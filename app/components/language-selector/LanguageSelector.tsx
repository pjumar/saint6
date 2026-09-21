"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLFieldSetElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownId = useId();
  const { locale, language } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLanguageSelect = (_newLocale: "en" | "vi") => {
    setIsOpen(false);
  };

  const containerClass =
    variant === "menu" ? styles.menuLanguageSelector : styles.languageSelector;
  const caretClass =
    variant === "menu" ? styles.menuCaretIcon : styles.caretIcon;

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <fieldset
      aria-label={locale === "vi" ? "Ngôn ngữ" : "Language"}
      ref={containerRef}
      className={`${styles.hoverContainer} ${className || ""}`}
      onPointerEnter={(event) => {
        if (variant === "default" && event.pointerType === "mouse")
          setIsOpen(true);
      }}
      onPointerLeave={(event) => {
        if (
          variant === "default" &&
          event.pointerType === "mouse" &&
          !event.currentTarget.contains(document.activeElement)
        )
          setIsOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={containerClass}
        onClick={handleClick}
        aria-label={locale === "vi" ? "Chọn ngôn ngữ" : "Choose language"}
        aria-expanded={isOpen}
        aria-controls={dropdownId}
      >
        <span className="caption">{language}</span>
        <span className={caretClass} aria-hidden="true" />
      </button>
      {isOpen && variant === "default" && (
        <div className={styles.dropdownBridge} />
      )}
      {isOpen && (
        <div
          id={dropdownId}
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
    </fieldset>
  );
}
