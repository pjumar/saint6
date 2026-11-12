import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { normalizeAdAttribution } from "../strapi/src/utils/enquiry-attribution";

const capture = readFileSync("public/scripts/capture-utm.js", "utf8");
const key = "saint6_utm_params";

test("new campaign arrivals replace old click IDs; untagged navigation retains the acquisition", () => {
  const storage = new Map<string, string>();
  const visit = (search: string, pathname: string) =>
    runInNewContext(capture, {
      URLSearchParams,
      location: { search, pathname },
      sessionStorage: { setItem: (k: string, v: string) => storage.set(k, v) },
    });
  visit("?gclid=google-fixture&gad_campaignid=123", "/vi/studio-rental");
  visit("", "/vi/contact");
  assert.equal(JSON.parse(storage.get(key)!).gclid, "google-fixture");
  visit("?utm_source=facebook&utm_campaign=new-campaign", "/vi/set-design");
  const actual = JSON.parse(storage.get(key)!);
  assert.equal(actual.gclid, undefined);
  assert.equal(actual.gad_campaignid, undefined);
  assert.equal(actual.utm_source, "facebook");
  assert.equal(actual._landing, "/vi/set-design");
});

test("production saves allowlisted ad references without emitting them to analytics; preview suppresses them", () => {
  for (const environment of ["production", "preview"]) {
    const script = `
      global.window={dataLayer:[], sessionStorage:{getItem:()=>JSON.stringify({
        gclid:'click-fixture',gbraid:'braid-fixture',gad_campaignid:'123',
        wbraid:'https://invalid.example/',email:'private@example.invalid'
      }),removeItem:()=>{throw new Error('blocked')}}};
      const {submissionData}=require('./app/lib/form-submissions.ts');
      const {clearUtmParams}=require('./app/hooks/useUtmParams.ts');
      const data=submissionData({name:'QA',trafficSource:'google_ads'});
      clearUtmParams();
      console.log(JSON.stringify({data,events:window.dataLayer}));
    `;
    const r = spawnSync(process.execPath, ["--import", "tsx", "-e", script], {
      encoding: "utf8",
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_ENVIRONMENT: environment,
        NEXT_PUBLIC_PREVIEW_FORM_TESTS_ENABLED: "true",
      },
    });
    assert.equal(r.status, 0, r.stderr);
    const actual = JSON.parse(r.stdout);
    assert.deepEqual(actual.events, []);
    assert.deepEqual(
      actual.data.adAttribution,
      environment === "production"
        ? {
            gclid: "click-fixture",
            gbraid: "braid-fixture",
            gad_campaignid: "123",
          }
        : undefined,
    );
  }
});

test("untrusted attribution is bounded and excludes personal fields", () => {
  assert.deepEqual(
    normalizeAdAttribution({
      gclid: "fixture",
      email: "private@example.invalid",
      message: "private",
    }),
    { gclid: "fixture" },
  );
  for (const value of [
    null,
    [],
    "bad",
    { gclid: "x".repeat(513) },
    { gclid: "https://invalid.example/" },
  ]) {
    assert.equal(normalizeAdAttribution(value), null);
  }
});

test("both enquiry APIs save before notification and return the same reference used in mail", async () => {
  const requireStrapi = createRequire(resolve("strapi/package.json"));
  const { Resend } = requireStrapi("resend");
  const originalPost = Resend.prototype.post;
  const originalKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "re_test_fixture";
  try {
    for (const kind of ["contact", "booking"]) {
      const controllerFactory = requireStrapi(
        `./src/api/${kind}-submission/controllers/${kind}-submission.ts`,
      ).default;
      for (const outcome of [
        "success",
        "email-failure",
        "status-failure",
        "database-failure",
      ]) {
        const steps: string[] = [];
        let saved: Record<string, unknown> | undefined;
        let mail: Record<string, unknown> | undefined;
        Resend.prototype.post = async (
          _path: string,
          payload: Record<string, unknown>,
        ) => {
          steps.push("notify");
          mail = payload;
          return outcome === "email-failure"
            ? { error: { message: "fixture failure" } }
            : { data: { id: "fixture" } };
        };
        const strapi = {
          contentType: () => ({
            kind: "collectionType",
            uid: `api::${kind}-submission.${kind}-submission`,
          }),
          log: { error() {}, info() {} },
          entityService: {
            create: async (
              _uid: string,
              { data }: { data: Record<string, unknown> },
            ) => {
              steps.push("save");
              saved = data;
              if (outcome === "database-failure")
                throw new Error("fixture database failure");
              return { id: 42 };
            },
            update: async () => {
              steps.push("status");
              if (outcome === "status-failure")
                throw new Error("fixture update failure");
            },
          },
        };
        const ctx = {
          request: {
            body: {
              data: {
                name: "QA",
                email: "test@example.invalid",
                message: "Fixture",
                roomTitle: "Fixture room",
                phone: "+84900000000",
                dateFrom: "15/11/2026",
                timeFrom: "09:00",
                timeTo: "10:00",
                trafficSource: "google_ads",
                adAttribution: {
                  gclid: "click-fixture",
                  email: "discard@example.invalid",
                },
              },
            },
          },
          badRequest() {
            throw new Error("unexpected validation failure");
          },
        };
        const controller = controllerFactory({ strapi });
        if (outcome === "database-failure") {
          await assert.rejects(
            controller.create(ctx),
            /fixture database failure/,
          );
          assert.deepEqual(steps, ["save"]);
          continue;
        }
        const response = await controller.create(ctx);
        assert.equal(steps[0], "save");
        assert.deepEqual(saved?.adAttribution, { gclid: "click-fixture" });
        assert.equal(response.data.enquiryReference, `${kind}-42`);
        assert.equal(response.data.emailSent, outcome !== "email-failure");
        assert.equal(response.data.adAttribution, undefined);
        assert.match(String(mail?.subject), new RegExp(`\\[${kind}-42\\]`));
        assert.match(String(mail?.text), new RegExp(`${kind}-42`));
        assert.match(String(mail?.html), new RegExp(`${kind}-42`));
        assert.equal(JSON.stringify(mail).includes("click-fixture"), false);
        assert.equal(String(mail?.text).includes("Source: google_ads"), true);
        assert.equal(String(mail?.html).includes("google_ads"), true);
      }
    }
  } finally {
    Resend.prototype.post = originalPost;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
  }
});
