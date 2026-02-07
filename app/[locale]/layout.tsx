import type { Metadata } from "next";
import { JetBrains_Mono, Public_Sans, Saira_Condensed } from "next/font/google";
import "@/app/globals.css";
import { ErrorBoundary } from "@/app/components/error-boundary";
import { FloatingMessengerButton } from "@/app/components/floating-messenger-button";
import { Footer } from "@/app/components/footer/Footer";
import { TranslationProvider } from "@/app/contexts/TranslationContext";
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

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://saint6.vercel.app",
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
      default: isVi
        ? "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền"
        : "Saint 6 Studio | Exclusive Production & Event Destination",
      template: "%s | Saint 6 Studio",
    },
    description: isVi
      ? "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn. Thuê studio, thiết kế set, dịch vụ sản xuất và giải pháp sáng tạo được điều chỉnh theo nhu cầu của bạn."
      : "An exclusive destination for elevated productions, private events, and visionary experiences. Studio rental, set design, production services, and creative solutions tailored to your needs.",
    keywords: [
      "studio rental",
      "set design",
      "production services",
      "event planning",
      "creative studio",
      "film production",
      "photography studio",
      "event venue",
    ],
    authors: [{ name: "Saint 6 Studio" }],
    creator: "Saint 6 Studio",
    openGraph: {
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
      url: `/${typedLocale}`,
      siteName: "Saint 6 Studio",
      title: isVi
        ? "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền"
        : "Saint 6 Studio | Exclusive Production & Event Destination",
      description: isVi
        ? "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn."
        : "An exclusive destination for elevated productions, private events, and visionary experiences.",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Saint 6 Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isVi
        ? "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền"
        : "Saint 6 Studio | Exclusive Production & Event Destination",
      description: isVi
        ? "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn."
        : "An exclusive destination for elevated productions, private events, and visionary experiences.",
      images: ["/twitter-image.jpg"],
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
