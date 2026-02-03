import { SOCIAL_LINKS } from "@/app/constants/social-links";
import styles from "./SocialLinks.module.css";

interface SocialLinksProps {
  variant?: "default" | "menu";
}

export function SocialLinks({ variant = "default" }: SocialLinksProps) {
  const containerClass =
    variant === "menu" ? styles.menuSocialLinks : styles.socialLinks;

  return (
    <div className={containerClass}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          className="caption"
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.shortLabel}
        </a>
      ))}
    </div>
  );
}
