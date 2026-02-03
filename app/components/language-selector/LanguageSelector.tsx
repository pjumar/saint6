"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { switchLocale } from "@/app/lib/navigation";
import styles from "./LanguageSelector.module.css";

interface LanguageSelectorProps {
  variant?: "default" | "menu";
  className?: string;
}

export function LanguageSelector({
  variant = "default",
  className,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, language } = useTranslation();
  const pathname = usePathname();

  const handleLanguageSelect = (_newLocale: "en" | "vi") => {
    setIsOpen(false);
  };

  const containerClass =
    variant === "menu" ? styles.menuLanguageSelector : styles.languageSelector;
  const caretClass =
    variant === "menu" ? styles.menuCaretIcon : styles.caretIcon;

  const handleClick = () => {
    if (variant === "menu") {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`${styles.hoverContainer} ${className || ""}`}
      onMouseEnter={() => variant === "default" && setIsOpen(true)}
      onMouseLeave={() => variant === "default" && setIsOpen(false)}
    >
      <div
        className={containerClass}
        onClick={handleClick}
        style={{ cursor: variant === "menu" ? "pointer" : undefined }}
      >
        <span className="caption">{language}</span>
        <div className={caretClass} />
      </div>
      {isOpen && variant === "default" && (
        <div className={styles.dropdownBridge} />
      )}
      {isOpen && (
        <div className={styles.languageDropdown}>
          <Link
            href={switchLocale(pathname || `/${locale}`, "en")}
            className={styles.languageOption}
            onClick={() => handleLanguageSelect("en")}
          >
            EN
          </Link>
          <Link
            href={switchLocale(pathname || `/${locale}`, "vi")}
            className={styles.languageOption}
            onClick={() => handleLanguageSelect("vi")}
          >
            VI
          </Link>
        </div>
      )}
    </div>
  );
}
