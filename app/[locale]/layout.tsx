import type { Metadata } from "next";
import { Public_Sans, JetBrains_Mono, Spectral } from "next/font/google";
import "../globals.css";
import { Footer } from "../components/footer/Footer";
import { TranslationProvider } from "../contexts/TranslationContext";
import type { Locale } from "../types";

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

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === "vi";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://saint6studio.com"),
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
      url: `/${locale}`,
      siteName: "Saint 6 Studio",
      title: isVi
        ? "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền"
        : "Saint 6 Studio | Exclusive Production & Event Destination",
      description: isVi
        ? "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn."
        : "An exclusive destination for elevated productions, private events, and visionary experiences.",
    },
    twitter: {
      card: "summary_large_image",
      title: isVi
        ? "Saint 6 Studio | Điểm Đến Sản Xuất & Sự Kiện Độc Quyền"
        : "Saint 6 Studio | Exclusive Production & Event Destination",
      description: isVi
        ? "Một điểm đến độc quyền cho các sản xuất cao cấp, sự kiện riêng tư và trải nghiệm tầm nhìn."
        : "An exclusive destination for elevated productions, private events, and visionary experiences.",
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
  return [{ locale: "en" }, { locale: "vi" }];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${publicSans.variable} ${jetbrainsMono.variable} ${spectral.variable} antialiased`}
      >
        <TranslationProvider locale={locale}>
          {children}
          <Footer />
        </TranslationProvider>
      </body>
    </html>
  );
}

