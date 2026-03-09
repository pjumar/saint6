"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { useScrollAnimation } from "@/app/hooks";
import { SpiralDecoration } from "@/app/components/spiral-decoration";
import styles from "./ContactSection.module.css";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "https://strapi.saint6.studio";

export interface ContactSectionProps {
  backgroundImageUrl: string;
  onSubmit?: (data: ContactFormData) => void;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export function ContactSection({
  backgroundImageUrl,
  onSubmit,
}: ContactSectionProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  // Scroll animation for the contact card
  const cardRef = useScrollAnimation<HTMLDivElement>({
    type: "fadeUp",
    duration: 0.8,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus("idle");

    // Client-side validation
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });

      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={styles.contactSection}>
      {/* Background Image */}
      <div className={styles.backgroundContainer}>
        <Image
          src={backgroundImageUrl}
          alt="Contact background"
          fill
          sizes="100vw"
          className={styles.backgroundImage}
        />
      </div>

      {/* Contact Card */}
      <div className={styles.cardWrapper}>
        <div className={styles.contactCard} ref={cardRef}>
          {/* Red Header - hidden in success state */}
          {submitStatus !== "success" && (
            <div className={styles.cardHeader}>
              <SpiralDecoration
                className={styles.spiralDecoration}
                imageClassName={styles.spiralImage}
                width={360}
                height={244}
              />
              <div className={styles.headerContent}>
                <h2 className={styles.cardTitle}>{t.STUDIO_RENTAL.FORM.TITLE}</h2>
                <p className={styles.cardSubtitle}>
                  {t.STUDIO_RENTAL.FORM.SUBTITLE}
                </p>
              </div>
            </div>
          )}

          {/* Form / Success Area */}
          <div className={submitStatus === "success" ? styles.successContainer : styles.formContainer} suppressHydrationWarning>
            {submitStatus === "success" ? (
              <>
                <div className={styles.successDecoration}>
                  <Image
                    src="/images/spiral_decoration.svg"
                    alt=""
                    width={400}
                    height={400}
                    className={styles.successSpiralImage}
                  />
                </div>
                <div className={styles.successContent}>
                  <h3 className={styles.successTitle}>
                    {t.STUDIO_RENTAL.FORM.SUCCESS_TITLE}
                  </h3>
                  <p className={styles.successMsg}>
                    {t.STUDIO_RENTAL.FORM.SUCCESS_MESSAGE}
                  </p>
                </div>
              </>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup} suppressHydrationWarning>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={`${t.STUDIO_RENTAL.FORM.NAME}*`}
                    required
                    aria-required="true"
                  />
                </div>

                <div className={styles.formGroup} suppressHydrationWarning>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={`${t.STUDIO_RENTAL.FORM.EMAIL}*`}
                    required
                    aria-required="true"
                  />
                </div>

                <div className={styles.formGroup} suppressHydrationWarning>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={`${t.STUDIO_RENTAL.FORM.COMPANY}*`}
                    required
                    aria-required="true"
                  />
                </div>

                <div className={styles.formGroup} suppressHydrationWarning>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder={`${t.STUDIO_RENTAL.FORM.MESSAGE}*`}
                    rows={3}
                    required
                    aria-required="true"
                  />
                </div>

                <div className={styles.submitContainer}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? t.STUDIO_RENTAL.FORM.SENDING
                      : t.STUDIO_RENTAL.FORM.SUBMIT}
                  </button>
                  {submitStatus === "error" && (
                    <p className={styles.errorMessage}>
                      {t.STUDIO_RENTAL.FORM.ERROR}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
