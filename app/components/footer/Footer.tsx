import Image from "next/image";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerDecoration}>
        <Image
          src="/images/decoration-bg.svg"
          alt=""
          width={600}
          height={600}
          className={styles.footerDecorationBg}
        />
        <div className={styles.footerDecorationOverlay}>
          <Image
            src="/images/decoration-group.svg"
            alt=""
            width={600}
            height={600}
            className={styles.footerDecorationGroup}
          />
        </div>
      </div>

      <p className={styles.contactLabel}>CONTACT US</p>

      <div className={styles.logoWrapper}>
        <Image
          src="/assets/saint6-logo.svg"
          alt="Saint 6 Studio"
          width={297}
          height={63}
          className={styles.logo}
        />
      </div>

      <div className={styles.contactInfo}>
        <p className={styles.contactText}>6 Be Van Cam, Tan Kieng, District 7, HCMC</p>
        <p className={styles.contactText}>Saint6studios@gmail.com</p>
        <p className={styles.contactText}>0919 403 784 - 0918 756 573</p>
      </div>

      <div className={styles.footerLine} />

      <div className={styles.socialLinks}>
        <a href="#" className={styles.socialLink}>
          INSTAGRAM
        </a>
        <a href="#" className={styles.socialLink}>
          FACEBOOK
        </a>
        <a href="#" className={styles.socialLink}>
          TIKTOK
        </a>
      </div>
    </footer>
  );
}

