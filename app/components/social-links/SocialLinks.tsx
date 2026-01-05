import styles from "./SocialLinks.module.css";

interface SocialLinksProps {
  variant?: "default" | "menu";
}

export function SocialLinks({ variant = "default" }: SocialLinksProps) {
  const containerClass = variant === "menu" ? styles.menuSocialLinks : styles.socialLinks;

  return (
    <div className={containerClass}>
      <a href="#" className="caption">
        FB
      </a>
      <a href="#" className="caption">
        INST
      </a>
      <a href="#" className="caption">
        TIKTOK
      </a>
    </div>
  );
}

