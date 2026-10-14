"use client";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import styles from "./HamburgerMenu.module.css";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel?: string;
  dark?: boolean;
}

export function HamburgerMenu({
  isOpen,
  onClick,
  ariaLabel = "Menu",
  dark = false,
}: HamburgerMenuProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        styles.hamburgerMenu,
        isOpen && styles.hamburgerMenuOpen,
        dark && styles.hamburgerMenuDark,
      )}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <div className={styles.hamburgerLinePair}>
        <div className={styles.hamburgerLineThin} />
        <div className={styles.hamburgerLineThick} />
      </div>
      <div className={styles.hamburgerLinePair}>
        <div className={styles.hamburgerLineThin} />
        <div className={styles.hamburgerLineThick} />
      </div>
    </Button>
  );
}
