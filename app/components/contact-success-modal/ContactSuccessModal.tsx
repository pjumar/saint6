"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";
import styles from "./ContactSuccessModal.module.css";

export interface ContactSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function ContactSuccessModal({
  isOpen,
  onClose,
  title = "Thank you for reaching out",
  message = "Your message has been received — our team will get back to you shortly to assist with your request.",
}: ContactSuccessModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.decoration}>
          <Image
            src="/images/spiral_decoration.svg"
            alt=""
            width={400}
            height={400}
            className={styles.spiralImage}
          />
        </div>

        <div className={styles.content}>
          <h2 id="success-modal-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.message}>{message}</p>
        </div>
      </div>
    </div>
  );
}
