"use client";

import Image from "next/image";
import {
  type FormEvent,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import { Calendar } from "@/app/components/ui/calendar";
import styles from "./BookingModal.module.css";

export interface BookingRoomData {
  title: string;
  pricePerHour: string;
  description: string;
  space: string;
  width: string;
  ceilingHeight: string;
  wallType?: string;
  imageUrl: string;
  gallery?: { url: string; alt?: string }[];
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: BookingRoomData[];
  initialRoomIndex?: number;
}

type ModalState = "details" | "booking" | "success";

export function BookingModal({
  isOpen,
  onClose,
  rooms,
  initialRoomIndex = 0,
}: BookingModalProps) {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState<ModalState>("details");
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(initialRoomIndex);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    timeFrom: "",
    timeTo: "",
    name: "",
    email: "",
    phone: "",
  });

  const room = rooms[selectedRoomIndex];
  const images =
    room?.gallery && room.gallery.length > 0
      ? room.gallery
      : room
        ? [{ url: room.imageUrl, alt: room.title }]
        : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setModalState("details");
      setSelectedRoomIndex(initialRoomIndex);
      setCurrentImageIndex(0);
      setDateRange(undefined);
      setFormData({
        timeFrom: "",
        timeTo: "",
        name: "",
        email: "",
        phone: "",
      });
    }
  }, [isOpen, initialRoomIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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

  // Close calendar on click outside
  useEffect(() => {
    if (!isCalendarOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);

  // Tab scroll arrows visibility
  const [tabArrows, setTabArrows] = useState({ left: false, right: false });

  const updateTabArrows = useCallback(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    setTabArrows({
      left: tabs.scrollLeft > 1,
      right: tabs.scrollLeft + tabs.clientWidth < tabs.scrollWidth - 1,
    });
  }, []);

  // Convert vertical wheel/trackpad events to horizontal scroll on tabs
  useEffect(() => {
    if (!isOpen) return;
    const tabs = tabsRef.current;
    if (!tabs) return;
    updateTabArrows();
    const handleWheel = (e: WheelEvent) => {
      if (tabs.scrollWidth <= tabs.clientWidth) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        tabs.scrollLeft += e.deltaY;
      }
    };
    tabs.addEventListener("wheel", handleWheel, { passive: false });
    tabs.addEventListener("scroll", updateTabArrows);
    return () => {
      tabs.removeEventListener("wheel", handleWheel);
      tabs.removeEventListener("scroll", updateTabArrows);
    };
  }, [isOpen, modalState, updateTabArrows]);

  const scrollTabs = (direction: "left" | "right") => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    tabs.scrollBy({ left: direction === "left" ? -120 : 120, behavior: "smooth" });
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    // Auto-close when a full range is selected (from and to are different days)
    if (
      range?.from &&
      range?.to &&
      range.from.getTime() !== range.to.getTime()
    ) {
      setIsCalendarOpen(false);
    }
  };

  const handleRoomTabClick = (index: number) => {
    setSelectedRoomIndex(index);
    setCurrentImageIndex(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !dateRange?.from || !formData.timeFrom || !formData.timeTo) {
      setShowErrors(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomTitle: room.title,
          dateFrom: dateRange?.from
            ? format(dateRange.from, "dd/MM/yyyy")
            : "",
          dateTo: dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : "",
          timeFrom: formData.timeFrom,
          timeTo: formData.timeTo,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      setModalState("success");
    } catch (error) {
      console.error("Booking submission error:", error);
      setModalState("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !room || !mounted) return null;

  const currentImage = images[currentImageIndex];

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={t.STUDIO_RENTAL.ROOMS.MAKE_BOOKING}
        onClick={(e) => e.stopPropagation()}
      >
      {/* Image Panel */}
      <div className={styles.imagePanel}>
        <Image
          src={currentImage.url}
          alt={currentImage.alt || room.title}
          fill
          className={styles.roomImage}
          sizes="66vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              className={`${styles.imageNav} ${styles.prevButton}`}
              onClick={() =>
                setCurrentImageIndex(
                  (prev) => (prev - 1 + images.length) % images.length
                )
              }
              aria-label="Previous image"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M30 12L18 24L30 36"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={`${styles.imageNav} ${styles.nextButton}`}
              onClick={() =>
                setCurrentImageIndex((prev) => (prev + 1) % images.length)
              }
              aria-label="Next image"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M18 12L30 24L18 36"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className={styles.pagination}>
            {images.map((_, index) => (
              <button
                key={index}
                className={`${styles.paginationDot} ${
                  index === currentImageIndex
                    ? styles.paginationDotActive
                    : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Close button — modal level for correct mobile positioning */}
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M14 14L34 34"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M34 14L14 34"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Content Panel */}
      <div className={styles.contentPanel}>

        {/* ==================== */}
        {/* STATE: DETAILS       */}
        {/* ==================== */}
        {modalState === "details" && (
          <div className={styles.detailsContent}>
            <div className={styles.tabsWrapper}>
              {tabArrows.left && (
                <button
                  className={`${styles.tabArrow} ${styles.tabArrowLeft}`}
                  onClick={() => scrollTabs("left")}
                  aria-label="Scroll tabs left"
                >
                  &lt;
                </button>
              )}
              <div className={styles.roomTabs} ref={tabsRef}>
                {rooms.map((r, index) => (
                  <button
                    key={index}
                    className={`${styles.roomTab} ${
                      index === selectedRoomIndex ? styles.roomTabActive : ""
                    }`}
                    onClick={() => handleRoomTabClick(index)}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
              {tabArrows.right && (
                <button
                  className={`${styles.tabArrow} ${styles.tabArrowRight}`}
                  onClick={() => scrollTabs("right")}
                  aria-label="Scroll tabs right"
                >
                  &gt;
                </button>
              )}
            </div>

            <div className={styles.roomInfo}>
              <h2 className={styles.roomName}>{room.title}</h2>
              <p className={styles.roomPrice}>
                {room.pricePerHour}
                {t.STUDIO_RENTAL.ROOMS.PER_HOUR}
              </p>
              <p className={styles.roomDescription}>{room.description}</p>
            </div>

            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>
                  {t.STUDIO_RENTAL.ROOMS.SPACE}
                </span>
                <span className={styles.specValue}>{room.space}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>
                  {t.STUDIO_RENTAL.ROOMS.WIDTH}
                </span>
                <span className={styles.specValue}>{room.width}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>
                  {t.STUDIO_RENTAL.ROOMS.CEILING_HEIGHT}
                </span>
                <span className={styles.specValue}>{room.ceilingHeight}</span>
              </div>
              {room.wallType && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>
                    {t.STUDIO_RENTAL.BOOKING.WALL_TYPE}
                  </span>
                  <span className={styles.specValue}>{room.wallType}</span>
                </div>
              )}
            </div>

            <div className={styles.detailsActions}>
              <CommonButton
                variant="primary"
                size="lg"
                onClick={() => setModalState("booking")}
              >
                {t.STUDIO_RENTAL.ROOMS.MAKE_BOOKING}
              </CommonButton>
            </div>
          </div>
        )}

        {/* ==================== */}
        {/* STATE: BOOKING       */}
        {/* ==================== */}
        {modalState === "booking" && (
          <div className={styles.bookingContent}>
            <button
              className={styles.backLink}
              onClick={() => setModalState("details")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t.STUDIO_RENTAL.BOOKING.VIEW_OTHER_STUDIO}</span>
            </button>

            <h2 className={styles.bookingHeading}>
              {t.STUDIO_RENTAL.ROOMS.MAKE_BOOKING}
            </h2>

            <form
              className={styles.bookingForm}
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Date range picker */}
              <div className={styles.dateRangeContainer} ref={calendarRef}>
                <button
                  type="button"
                  className={`${styles.dateRangeWrapper} ${showErrors && !dateRange?.from ? styles.inputError : ""}`}
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                >
                  <span className={styles.dateRangeDisplay}>
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          <span className={styles.dateRangeValue}>
                            {format(dateRange.from, "dd/MM/yyyy")}
                          </span>
                          <span className={styles.dateRangeSeparator}>
                            —
                          </span>
                          <span className={styles.dateRangeValue}>
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className={styles.dateRangeValue}>
                            {format(dateRange.from, "dd/MM/yyyy")}
                          </span>
                          <span className={styles.dateRangeSeparator}>
                            —
                          </span>
                          <span className={styles.dateRangePlaceholder}>
                            DD/MM/YYYY
                          </span>
                        </>
                      )
                    ) : (
                      <>
                        <span className={styles.dateRangePlaceholder}>
                          DD/MM/YYYY
                        </span>
                        <span className={styles.dateRangeSeparator}>
                          —
                        </span>
                        <span className={styles.dateRangePlaceholder}>
                          DD/MM/YYYY
                        </span>
                      </>
                    )}
                  </span>
                  <label className={styles.inputLabel}>
                    {t.STUDIO_RENTAL.BOOKING.DATE}*
                  </label>
                  <span className={styles.inputIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M16 2V6M8 2V6M3 10H21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                {isCalendarOpen && (
                  <div className={styles.calendarDropdown}>
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={1}
                    />
                  </div>
                )}
              </div>

              {/* Time fields */}
              <div className={styles.timeRow}>
                <div className={styles.inputWrapper}>
                  <input
                    type="time"
                    name="timeFrom"
                    value={formData.timeFrom}
                    onChange={handleChange}
                    className={`${styles.input} ${styles.inputNative} ${showErrors && !formData.timeFrom ? styles.inputError : ""}`}
                    aria-label={t.STUDIO_RENTAL.BOOKING.FROM}
                  />
                  <label className={styles.inputLabel}>
                    {t.STUDIO_RENTAL.BOOKING.FROM}*
                  </label>
                  <span className={styles.inputIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 7V12L15 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    type="time"
                    name="timeTo"
                    value={formData.timeTo}
                    onChange={handleChange}
                    className={`${styles.input} ${styles.inputNative} ${showErrors && !formData.timeTo ? styles.inputError : ""}`}
                    aria-label={t.STUDIO_RENTAL.BOOKING.TO}
                  />
                  <label className={styles.inputLabel}>
                    {t.STUDIO_RENTAL.BOOKING.TO}*
                  </label>
                  <span className={styles.inputIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 7V12L15 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Name */}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  className={`${styles.input} ${showErrors && !formData.name ? styles.inputError : ""}`}
                  required
                />
                <label className={styles.inputLabel}>
                  {t.STUDIO_RENTAL.BOOKING.NAME}*
                </label>
              </div>

              {/* Email */}
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className={`${styles.input} ${showErrors && !formData.email ? styles.inputError : ""}`}
                  required
                />
                <label className={styles.inputLabel}>
                  {t.STUDIO_RENTAL.BOOKING.EMAIL}*
                </label>
              </div>

              {/* Phone */}
              <div className={styles.inputWrapper}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=" "
                  className={`${styles.input} ${showErrors && !formData.phone ? styles.inputError : ""}`}
                  required
                />
                <label className={styles.inputLabel}>
                  {t.STUDIO_RENTAL.BOOKING.PHONE}*
                </label>
              </div>

              {/* Submit */}
              <CommonButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t.STUDIO_RENTAL.FORM.SENDING
                  : t.STUDIO_RENTAL.BOOKING.RESERVE}
              </CommonButton>
            </form>
          </div>
        )}

        {/* ==================== */}
        {/* STATE: SUCCESS       */}
        {/* ==================== */}
        {modalState === "success" && (
          <div className={styles.successContent}>
            <div className={styles.successBody}>
              <div className={styles.successText}>
                <h2 className={styles.successHeading}>
                  {t.STUDIO_RENTAL.BOOKING.SUCCESS_TITLE}
                </h2>
                <p className={styles.successMessage}>
                  {t.STUDIO_RENTAL.BOOKING.SUCCESS_MESSAGE}
                </p>
              </div>
              <CommonButton variant="primary" size="lg" onClick={onClose}>
                {t.STUDIO_RENTAL.BOOKING.BACK_TO_STUDIOS}
              </CommonButton>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>,
    document.body
  );
}
