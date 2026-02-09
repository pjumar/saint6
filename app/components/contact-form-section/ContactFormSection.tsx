"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { ContactSuccessModal } from "@/app/components/contact-success-modal";
import { useScrollAnimation } from "@/app/hooks";
import styles from "./ContactFormSection.module.css";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "https://strapi.saint6.studio";

// Reuse the ContactFormData interface from ContactSection
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface ContactFormSectionProps {
  title?: string;
  subtitle?: string;
  onSubmit?: (data: ContactFormData) => void;
}

export function ContactFormSection({
  title,
  subtitle,
  onSubmit,
}: ContactFormSectionProps) {
  const { t } = useTranslation();
  const headerRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const formRef = useScrollAnimation<HTMLDivElement>({
    type: "fadeUp",
    delay: 0.2,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  // Use translations with fallbacks
  const contactTranslations =
    (t as { CONTACT_US?: Record<string, unknown> }).CONTACT_US || {};
  const formTranslations =
    (contactTranslations.FORM as Record<string, string>) || {};

  const displayTitle = title ?? formTranslations.TITLE ?? "Get in touch";
  const displaySubtitle =
    subtitle ?? formTranslations.SUBTITLE ?? "Let's Build Something Beautiful";

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
      setShowSuccessModal(true);
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
    <section className={styles.contactFormSection}>
      <div className={styles.container}>
        {/* Red Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.spiralDecoration}>
            <Image
              src="/images/spiral_decoration.svg"
              alt=""
              width={360}
              height={244}
              className={styles.spiralImage}
            />
          </div>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>{displayTitle}</h2>
            <p className={styles.subtitle}>{displaySubtitle}</p>
          </div>
        </div>

        {/* White Form Area */}
        <div ref={formRef} className={styles.formContainer} suppressHydrationWarning>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup} suppressHydrationWarning>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder={`${formTranslations.NAME ?? "Name"}*`}
                  required
                  aria-required="true"
                />
              </div>

              <div className={styles.formGroup} suppressHydrationWarning>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder={`${formTranslations.EMAIL ?? "Email"}*`}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className={styles.formGroup} suppressHydrationWarning>
              <input
                type="text"
                id="contact-company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={styles.input}
                placeholder={`${formTranslations.COMPANY ?? "Company"}*`}
                required
                aria-required="true"
              />
            </div>

            <div className={styles.formGroup} suppressHydrationWarning>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                placeholder={`${formTranslations.MESSAGE ?? "Message"}*`}
                rows={5}
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
                  ? (formTranslations.SENDING ?? "Sending...")
                  : (formTranslations.SUBMIT ?? "Submit")}
              </button>
              {submitStatus === "error" && (
                <p className={styles.errorMessage}>
                  {formTranslations.ERROR ?? "Something went wrong. Please try again."}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <ContactSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={formTranslations.SUCCESS_TITLE ?? "Thank you for reaching out"}
        message={formTranslations.SUCCESS_MESSAGE ?? "Your message has been received — our team will get back to you shortly to assist with your request."}
      />
    </section>
  );
}
