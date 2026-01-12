import Image from "next/image";
import styles from "./RoomCard.module.css";
import { Button } from "@/app/components/ui/button";

export interface RoomCardProps {
  imageUrl: string;
  title: string;
  pricePerHour: string;
  counter: string;
  space: string;
  width: string;
  ceilingHeight: string;
  description: string;
  showEnterButton?: boolean;
}

export function RoomCard({
  imageUrl,
  title,
  pricePerHour,
  counter,
  space,
  width,
  ceilingHeight,
  description,
  showEnterButton = false,
}: RoomCardProps) {
  return (
    <div className={styles.roomCard}>
      {/* Room Image */}
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

      {/* Room Content */}
      <div className={styles.content}>
        {/* Title and Price Row */}
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.price}>
            <span className={styles.priceAmount}>{pricePerHour}</span>
            <span className={styles.priceUnit}>/hour</span>
          </div>
        </div>

        {/* Room Counter */}
        <div className={styles.counter}>{counter}</div>

        {/* Room Specs */}
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

        {/* Description */}
        <p className={styles.description}>{description}</p>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Button variant="default" size="lg">
            Make a Booking
          </Button>
          <Button variant="outline" size="lg">
            Gallery
          </Button>
        </div>
      </div>
    </div>
  );
}
