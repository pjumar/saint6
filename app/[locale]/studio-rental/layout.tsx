import type { Metadata } from "next";
import type { Locale } from "@/app/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const isVi = typedLocale === "vi";

  return {
    title: isVi
      ? "Thuê Studio | Saint 6 Studio"
      : "Studio Rental | Saint 6 Studio",
    description: isVi
      ? "Thuê không gian studio chuyên nghiệp của chúng tôi cho các dự án sáng tạo của bạn. The Loft, The Studio, The Arena và các phòng concept theo mùa có sẵn cho chụp ảnh, sản xuất và sự kiện."
      : "Rent our professional studio spaces for your creative projects. The Loft, The Studio, The Arena, and seasonal concept rooms available for photoshoots, productions, and events.",
    openGraph: {
      title: isVi
        ? "Thuê Studio | Saint 6 Studio"
        : "Studio Rental | Saint 6 Studio",
      description: isVi
        ? "Thuê không gian studio chuyên nghiệp của chúng tôi cho các dự án sáng tạo của bạn."
        : "Rent our professional studio spaces for your creative projects.",
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isVi
        ? "Thuê Studio | Saint 6 Studio"
        : "Studio Rental | Saint 6 Studio",
      description: isVi
        ? "Thuê không gian studio chuyên nghiệp của chúng tôi cho các dự án sáng tạo của bạn."
        : "Rent our professional studio spaces for your creative projects.",
    },
  };
}

export default function StudioRentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
