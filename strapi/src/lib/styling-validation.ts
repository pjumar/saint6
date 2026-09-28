import type { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const uid = "api::styling-project.styling-project";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validVideo(value: unknown) {
  if (value == null || value === "") return true;
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return false;
    const host = url.hostname.replace(/^www\./, "");
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(
              host,
            )
          ? url.pathname === "/watch"
            ? url.searchParams.get("v")
            : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1]
          : null;
    return typeof id === "string" && /^[\w-]{11}$/.test(id);
  } catch {
    return false;
  }
}

export function registerStylingValidation(strapi: Core.Strapi) {
  let writes: Promise<unknown> = Promise.resolve();
  strapi.documents.use(async (context, next) => {
    if (context.uid === uid && context.action === "clone")
      throw new errors.ValidationError(
        "Create a new project with its own URL instead of duplicating an existing project. Copy the content into the new entry.",
      );
    if (
      context.uid !== uid ||
      !["create", "update", "publish"].includes(context.action)
    )
      return next();
    const run = () =>
      strapi.db.transaction(async ({ trx }) => {
        // The cloud database lock also serializes writes across separate server instances.
        if (strapi.db.getInfo().client === "postgres")
          await trx.raw("SELECT pg_advisory_xact_lock(?)", [684713206]);
        const params = context.params as {
          documentId?: string;
          status?: string;
          locale?: string;
          data?: Record<string, unknown>;
        };
        const entries = params.documentId
          ? await strapi.db
              .query(uid)
              .findMany({ where: { documentId: params.documentId } })
          : [];
        const current =
          entries.find(
            (entry) => entry.locale === params.locale && !entry.publishedAt,
          ) ||
          entries.find((entry) => !entry.publishedAt) ||
          entries[0];
        const slug = params.data?.slug ?? current?.slug;
        if (typeof slug !== "string" || !slugPattern.test(slug)) {
          throw new errors.ValidationError(
            "Use a project URL with lowercase letters, numbers and hyphens.",
          );
        }
        if (slug === "projects") {
          throw new errors.ValidationError(
            "The URL 'projects' is reserved for the portfolio. Choose a different project slug.",
          );
        }
        const locked =
          entries.find((entry) => entry.locked_slug)?.locked_slug ||
          entries.find((entry) => entry.publishedAt)?.slug;
        if (locked && slug !== locked) {
          throw new errors.ValidationError(
            "This project URL has already been published. Keep it unchanged; ask the site administrator to plan a redirect before renaming it.",
          );
        }
        const duplicate = await strapi.db.query(uid).findOne({
          where: {
            slug,
            ...(params.documentId
              ? { documentId: { $ne: params.documentId } }
              : {}),
          },
          select: ["id"],
        });
        if (duplicate)
          throw new errors.ValidationError(
            "Another project already uses this URL. Choose a different slug, or switch language on the existing project to add its translation.",
          );
        const video =
          params.data &&
          Object.getOwnPropertyDescriptor(params.data, "video_url")
            ? params.data.video_url
            : current?.video_url;
        if (!validVideo(video))
          throw new errors.ValidationError(
            "Enter a valid HTTPS YouTube watch, share, Shorts or embed URL, or leave the film field empty.",
          );
        if (params.data) {
          // Never allow an editor/API request to clear an established URL lock.
          params.data.locked_slug =
            locked || (params.status === "published" ? slug : null);
        }
        const result = await next();
        if (context.action === "publish" && params.documentId) {
          await strapi.db.query(uid).updateMany({
            where: { documentId: params.documentId },
            data: { locked_slug: slug },
          });
        }
        return result;
      });
    // SQLite is used only for the isolated local CMS and supports one writer.
    if (strapi.db.getInfo().client !== "sqlite") return run();
    const result = writes.then(run, run);
    writes = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  });
}
