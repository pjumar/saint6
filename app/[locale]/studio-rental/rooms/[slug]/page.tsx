import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { getRentalRooms } from "@/app/lib/studio-rental/rooms";
import type { Locale } from "@/app/types";
import { RoomBookingButton } from "./RoomBookingButton";
import styles from "./RoomDetail.module.css";

type Props = { params: Promise<{ locale: string; slug: string }> };
export const revalidate = 3600;

// Generate and cache each room after its first visit to keep builds light.
export function generateStaticParams() {
  return [];
}

async function content(params: Props["params"]) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "vi") notFound();
  const rooms = await getRentalRooms(locale);
  const room = rooms.find((entry) => entry.id === slug);
  if (!room) notFound();
  return { locale: locale as Locale, room, rooms };
}

export async function generateMetadata({ params }: Props) {
  const { locale, room } = await content(params);
  const title = `${room.title} | ${locale === "vi" ? "Thuê studio" : "Studio rental"}`;
  const description = `${room.title} · ${room.space}. ${room.description}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/studio-rental/rooms/${room.id}`,
      languages: {
        en: `/en/studio-rental/rooms/${room.id}`,
        vi: `/vi/studio-rental/rooms/${room.id}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ url: room.imageUrl, alt: room.imageAlt }],
    },
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const { locale, room, rooms } = await content(params);
  const vi = locale === "vi";
  const related = rooms
    .filter((candidate) => candidate.id !== room.id)
    .sort((a, b) => Number(b.type === room.type) - Number(a.type === room.type))
    .slice(0, 3);
  const bookingRoom = {
    title: room.title,
    pricePerHour: room.pricePerHour,
    description: room.description,
    space: room.space,
    width: room.width,
    ceilingHeight: room.ceilingHeight,
    imageUrl: room.imageUrl,
    gallery: room.gallery,
  };

  return (
    <>
      <main className={styles.page}>
        <nav
          className={styles.siteNav}
          aria-label={vi ? "Điều hướng chính" : "Main navigation"}
        >
          <Link
            className={styles.wordmark}
            href={`/${locale}`}
            aria-label="Saint 6 Studios home"
          >
            SAINT 6 <small>STUDIOS</small>
          </Link>
          <div className={styles.siteLinks}>
            <Link href={`/${locale}/studio-rental`}>
              {vi ? "Thuê studio" : "Studio rental"}
            </Link>
            <Link href={`/${locale}/portfolio`}>
              {vi ? "Dự án" : "Portfolio"}
            </Link>
            <Link href={`/${locale}/contact`}>
              {vi ? "Liên hệ" : "Contact"}
            </Link>
            <Link
              href={`/${vi ? "en" : "vi"}/studio-rental/rooms/${room.id}`}
              lang={vi ? "en" : "vi"}
            >
              {vi ? "EN" : "VI"}
            </Link>
          </div>
        </nav>
        <div className={styles.container}>
          <nav
            className={styles.breadcrumbs}
            aria-label={vi ? "Đường dẫn" : "Breadcrumb"}
          >
            <Link href={`/${locale}`}>Saint 6</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/studio-rental`}>
              {vi ? "Thuê studio" : "Studio rental"}
            </Link>
            <span aria-hidden="true">/</span>
            <span>{room.title}</span>
          </nav>

          <header className={styles.header}>
            <p className={styles.eyebrow}>
              {room.type === "concept"
                ? vi
                  ? "Phòng concept"
                  : "Concept room"
                : vi
                  ? "Phòng trống"
                  : "Empty room"}
              {" · "}
              {room.counter}
            </p>
            <h1>{room.title}</h1>
            <p className={styles.lead}>{room.description}</p>
          </header>

          <div className={styles.heroImage}>
            <Image
              src={room.imageUrl}
              alt={room.imageAlt}
              width={room.imageWidth}
              height={room.imageHeight}
              sizes="(max-width: 900px) 100vw, 75vw"
              priority
            />
          </div>

          <section
            className={styles.details}
            aria-label={vi ? "Thông tin phòng" : "Room details"}
          >
            <div>
              <h2>
                {vi
                  ? "Không gian cho ý tưởng của bạn"
                  : "A space for your next idea"}
              </h2>
              <p>{room.description}</p>
              <p className={styles.price}>
                {room.pricePerHour} {room.currency || "VND"}
                {vi ? "/giờ" : "/hour"}
              </p>
              <RoomBookingButton room={bookingRoom} />
            </div>
            <dl className={styles.specs}>
              <div>
                <dt>{room.specLabels?.area || (vi ? "Diện tích" : "Area")}</dt>
                <dd>{room.space}</dd>
              </div>
              {room.dimensions && (
                <div>
                  <dt>
                    {room.specLabels?.dimensions ||
                      (vi ? "Kích thước" : "Dimensions")}
                  </dt>
                  <dd>{room.dimensions}</dd>
                </div>
              )}
              {room.width && (
                <div>
                  <dt>
                    {room.specLabels?.width || (vi ? "Chiều rộng" : "Width")}
                  </dt>
                  <dd>{room.width}</dd>
                </div>
              )}
              {room.ceilingHeight && (
                <div>
                  <dt>
                    {room.specLabels?.ceiling_height ||
                      (vi ? "Chiều cao trần" : "Ceiling height")}
                  </dt>
                  <dd>{room.ceilingHeight}</dd>
                </div>
              )}
              {room.inclusions && (
                <div>
                  <dt>
                    {room.specLabels?.inclusions ||
                      (vi ? "Bao gồm" : "Included")}
                  </dt>
                  <dd>{room.inclusions}</dd>
                </div>
              )}
            </dl>
          </section>

          {room.gallery.length > 0 && (
            <section
              className={styles.gallery}
              aria-labelledby="room-gallery-title"
            >
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>
                  Saint 6 / {vi ? "Không gian" : "The space"}
                </p>
                <h2 id="room-gallery-title">
                  {vi ? "Khám phá phòng" : "Explore the room"}
                </h2>
              </div>
              <div className={styles.galleryGrid}>
                {room.gallery.map((image, index) => (
                  <Image
                    key={`${image.url}-${index}`}
                    src={image.url}
                    alt={image.alt || `${room.title} ${index + 1}`}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 700px) 100vw, 50vw"
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          )}

          <section
            className={styles.related}
            aria-labelledby="other-rooms-title"
          >
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>
                Saint 6 / {vi ? "Studio" : "Studios"}
              </p>
              <h2 id="other-rooms-title">
                {vi ? "Khám phá phòng khác" : "Explore other rooms"}
              </h2>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((candidate) => (
                <Link
                  href={candidate.href}
                  prefetch={false}
                  key={candidate.id}
                  className={styles.relatedCard}
                >
                  <Image
                    src={candidate.imageUrl}
                    alt={candidate.imageAlt}
                    width={candidate.imageWidth}
                    height={candidate.imageHeight}
                    sizes="(max-width: 700px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <span>{candidate.title} ↗</span>
                </Link>
              ))}
            </div>
            <Link
              className={styles.allRooms}
              href={`/${locale}/studio-rental#rooms`}
            >
              {vi ? "Xem tất cả phòng" : "View all rooms"} ↗
            </Link>
          </section>
        </div>
      </main>
      <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
    </>
  );
}
