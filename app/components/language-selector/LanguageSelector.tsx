"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { locale, language } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen || variant !== "menu") return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, variant]);

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
      ref={containerRef}
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
        <div
          className={`${styles.languageDropdown} ${variant === "menu" ? styles.languageDropdownUp : ""}`}
        >
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
