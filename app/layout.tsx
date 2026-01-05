import type { Metadata } from "next";
import { Public_Sans, JetBrains_Mono, Spectral } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://saint6studio.com"),
  title: {
    default: "Saint 6 Studio | Exclusive Production & Event Destination",
    template: "%s | Saint 6 Studio",
  },
  description:
    "An exclusive destination for elevated productions, private events, and visionary experiences. Studio rental, set design, production services, and creative solutions tailored to your needs.",
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
    locale: "en_US",
    url: "/",
    siteName: "Saint 6 Studio",
    title: "Saint 6 Studio | Exclusive Production & Event Destination",
    description:
      "An exclusive destination for elevated productions, private events, and visionary experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saint 6 Studio | Exclusive Production & Event Destination",
    description:
      "An exclusive destination for elevated productions, private events, and visionary experiences.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} ${jetbrainsMono.variable} ${spectral.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
