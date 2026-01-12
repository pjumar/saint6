"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import styles from "./InquiryForm.module.css";

export interface InquiryFormProps {
  onSubmit?: (data: InquiryFormData) => void;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  message: string;
}

export function InquiryForm({ onSubmit }: InquiryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (!formData.name || !formData.email || !formData.message) {
      console.log("Validation failed: Required fields missing");
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log("Validation failed: Invalid email format");
      setIsLoading(false);
      return;
    }

    // Simulate form submission (no backend yet)
    console.log("Form submitted:", formData);

    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        message: "",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
            aria-required="true"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
            aria-required="true"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="preferredDate" className={styles.label}>
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={styles.textarea}
          rows={6}
          required
          aria-required="true"
        />
      </div>

      <div className={styles.submitContainer}>
        <Button type="submit" variant="default" size="lg" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Inquiry"}
        </Button>
      </div>
    </form>
  );
}
