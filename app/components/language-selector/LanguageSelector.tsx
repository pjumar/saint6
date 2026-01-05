"use client";

import { useState } from "react";
import styles from "./LanguageSelector.module.css";

interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
  variant?: "default" | "menu";
  className?: string;
}

export function LanguageSelector({
  selectedLanguage = "EN",
  onLanguageChange,
  variant = "default",
  className,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(selectedLanguage);

  const handleLanguageSelect = (language: string) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language);
  };

  const containerClass = variant === "menu" ? styles.menuLanguageSelector : styles.languageSelector;
  const caretClass = variant === "menu" ? styles.menuCaretIcon : styles.caretIcon;

  return (
    <div
      className={`${containerClass} ${className || ""}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="caption">{currentLanguage}</span>
      <div className={caretClass} />
      {isOpen && variant === "default" && (
        <div
          className={styles.languageDropdown}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button
            className={styles.languageOption}
            onClick={() => handleLanguageSelect("EN")}
          >
            EN
          </button>
          <button
            className={styles.languageOption}
            onClick={() => handleLanguageSelect("VI")}
          >
            VI
          </button>
        </div>
      )}
    </div>
  );
}

