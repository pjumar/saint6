"use client";

import styles from "./HamburgerMenu.module.css";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

export function HamburgerMenu({ isOpen, onClick, ariaLabel = "Menu" }: HamburgerMenuProps) {
  return (
    <button
      className={`${styles.hamburgerMenu} ${isOpen ? styles.hamburgerMenuOpen : ""}`}
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
    </button>
  );
}

