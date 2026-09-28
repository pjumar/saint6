"use client";

import Image from "next/image";
import { type FormEvent, useState, useRef, useId } from "react";
import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { useScrollAnimation, useUtmParams, getTrafficSource, clearUtmParams } from "@/app/hooks";
import { SpiralDecoration } from "@/app/components/spiral-decoration";
import { formSubmissionsEnabled, submissionData, trackFormConversion, previewFormNotice } from "@/app/lib/form-submissions";
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
  const { t, locale, contactContent } = useTranslation();
  const pending = useRef(false);
  const formId = useId();
  const previewNotice = previewFormNotice(locale);
  const utmParams = useUtmParams();
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
    if (pending.current || !formSubmissionsEnabled) return;
    pending.current = true;
    setIsLoading(true);
    setSubmitStatus("idle");

    // Client-side validation
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      pending.current = false;
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      pending.current = false;
      setIsLoading(false);
      return;
    }

    try {
      const trafficSource = getTrafficSource(utmParams);
      const response = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: submissionData({
            ...formData,
            trafficSource,
            utmSource: utmParams.utm_source || null,
            utmMedium: utmParams.utm_medium || null,
            utmCampaign: utmParams.utm_campaign || null,
            landingPage: utmParams._landing || window.location.pathname,
          }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      let enquiryId: string | number | undefined;
      try {
        const result: { data?: { id?: string | number } } = await response.json();
        enquiryId = result.data?.id;
      } catch {
        // Tracking metadata must not hide a successful contact submission.
      }

      // Push conversion event to GTM dataLayer
      trackFormConversion({
        event: "contact_form_submit",
        form_name: "contact",
        traffic_source: trafficSource,
        utm_source: utmParams.utm_source || undefined,
        utm_medium: utmParams.utm_medium || undefined,
        utm_campaign: utmParams.utm_campaign || undefined,
        transaction_id:
          enquiryId != null ? `contact-${enquiryId}` : undefined,
        value: 1,
        currency: "VND",
      });

      clearUtmParams();
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
      pending.current = false;
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
      <div className={styles.contactIntro}>
        <h2>{contactContent?.heading || t.CONTACT_ENQUIRY.TITLE}</h2>
        <p>{contactContent?.text || t.CONTACT_ENQUIRY.TEXT}</p>
      </div>
      {/* Background Image */}
      <div className={styles.backgroundContainer}>
        <ProgressiveImage
          src={contactContent?.image.url || backgroundImageUrl}
          alt={contactContent?.image_alt || (locale === "vi" ? "Đội ngũ Saint 6 Studios" : "The Saint 6 Studios team")}
          fill
          sizes="100vw"
          unoptimized
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
                <h2 className={styles.cardTitle}>{contactContent?.form_title || t.STUDIO_RENTAL.FORM.TITLE}</h2>
                <p className={styles.cardSubtitle}>
                  {contactContent?.form_subtitle || t.STUDIO_RENTAL.FORM.SUBTITLE}
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
                <div className={styles.successContent} role="status" aria-live="polite">
                  <h3 className={styles.successTitle}>
                    {t.STUDIO_RENTAL.FORM.SUCCESS_TITLE}
                  </h3>
                  <p className={styles.successMsg}>
                    {t.STUDIO_RENTAL.FORM.SUCCESS_MESSAGE}
                  </p>
                </div>
              </>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} aria-busy={isLoading}>
                {previewNotice && <p role="note">{previewNotice}</p>}
                <div className={styles.formGroup} suppressHydrationWarning>
                  <input
                    type="text"
                    id={`${formId}-name`}
                    aria-label={t.STUDIO_RENTAL.FORM.NAME}
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
                    id={`${formId}-email`}
                    aria-label={t.STUDIO_RENTAL.FORM.EMAIL}
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
                    id={`${formId}-company`}
                    aria-label={t.STUDIO_RENTAL.FORM.COMPANY}
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
                    id={`${formId}-message`}
                    aria-label={t.STUDIO_RENTAL.FORM.MESSAGE}
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
                    disabled={isLoading || !formSubmissionsEnabled}
                  >
                    {isLoading
                      ? t.STUDIO_RENTAL.FORM.SENDING
                      : t.STUDIO_RENTAL.FORM.SUBMIT}
                  </button>
                  {submitStatus === "error" && (
                    <p className={styles.errorMessage} role="alert">
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
