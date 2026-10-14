import { notFound, permanentRedirect } from "next/navigation";
import { portfolioHref } from "@/app/lib/portfolio/content";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LegacyStylingPortfolio({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "vi") notFound();
  const values = await searchParams;
  const query =
    typeof values.q === "string" ? values.q.trim().slice(0, 120) : "";
  const category = typeof values.category === "string" ? "styling" : "";
  permanentRedirect(portfolioHref(locale, category, query));
}
