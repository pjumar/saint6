import Image from "next/image";
import styles from "./ConceptRoomCard.module.css";
import { Button } from "@/app/components/ui/button";

export interface ConceptRoomCardProps {
  imageUrl: string;
  title: string;
  pricePerHour: string;
  space: string;
  width: string;
  ceilingHeight: string;
  description: string;
  showEnterButton?: boolean;
}

export function ConceptRoomCard({
  imageUrl,
  title,
  pricePerHour,
  space,
  width,
  ceilingHeight,
  description,
  showEnterButton = false,
}: ConceptRoomCardProps) {
  return (
    <div className={styles.conceptCard}>
      {/* Arch-shaped Image Container */}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={title}
          width={449}
          height={449}
          className={styles.roomImage}
        />
        {showEnterButton && (
          <button type="button" className={styles.enterButton}>
            <span className={styles.enterButtonText}>Enter the Room</span>
          </button>
        )}
      </div>

      {/* Content Box */}
      <div className={styles.contentBox}>
        {/* Title and Price Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.price}>{pricePerHour}/hour</p>
        </div>

        {/* Specs Section */}
        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Space</span>
            <span className={styles.specValue}>{space}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Width</span>
            <span className={styles.specValue}>{width}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Ceiling height</span>
            <span className={styles.specValue}>{ceilingHeight}</span>
          </div>
        </div>

        {/* Description and Actions */}
        <div className={styles.footer}>
          <p className={styles.description}>{description}</p>
          <div className={styles.actions}>
            <Button variant="default" size="lg" className={styles.bookingButton}>
              Make a Booking
            </Button>
            <Button variant="outline" size="lg" className={styles.galleryButton}>
              Gallery
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
