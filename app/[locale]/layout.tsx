import type { Metadata } from "next";
import { JetBrains_Mono, Public_Sans, Saira_Condensed } from "next/font/google";
import "@/app/globals.css";
import { ErrorBoundary } from "@/app/components/error-boundary";
import { FloatingMessengerButton } from "@/app/components/floating-messenger-button";
import { Footer } from "@/app/components/footer/Footer";
import { TranslationProvider } from "@/app/contexts/TranslationContext";
import { FALLBACK_SEO } from "@/app/lib/fallback";
import { getSeoMetadata, getStrapiImageUrl } from "@/app/lib/strapi";
import type { Locale } from "@/app/types";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const sairaCondensed = Saira_Condensed({
  variable: "--font-saira-condensed",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const isVi = typedLocale === "vi";

  const seo = await getSeoMetadata(typedLocale);
  const lang = isVi ? "vi" : "en";

  const siteName = seo?.site_name || FALLBACK_SEO.site_name;
  const defaultTitle = seo?.default_title || FALLBACK_SEO.title[lang];
  const titleTemplate = seo?.title_template || FALLBACK_SEO.title_template;
  const description = seo?.description || FALLBACK_SEO.description[lang];
  const keywords = seo?.keywords
    ? seo.keywords.split(",").map((k) => k.trim())
    : FALLBACK_SEO.keywords[lang];
  const ogImageUrl = getStrapiImageUrl(seo?.og_image) || FALLBACK_SEO.og_image;
  const twitterImageUrl =
    getStrapiImageUrl(seo?.twitter_image) || FALLBACK_SEO.twitter_image;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://saint6.studio",
    ),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description,
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
      url: `/${typedLocale}`,
      siteName,
      title: defaultTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [twitterImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }] as Array<{ locale: Locale }>;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  return (
    <html lang={typedLocale}>
      <body
        className={`${publicSans.variable} ${jetbrainsMono.variable} ${sairaCondensed.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <TranslationProvider locale={typedLocale}>
            {children}
            <Footer />
            <FloatingMessengerButton />
          </TranslationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
