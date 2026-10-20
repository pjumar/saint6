"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import {
  getOpenAIAdsConsent,
  initializeOpenAIAds,
  isOpenAIAdsEnabled,
  setOpenAIAdsConsent,
} from "@/app/lib/openai-ads";
import styles from "./OpenAIAdsConsent.module.css";

const PREFERENCES_EVENT = "saint6:openai-ads-preferences";

export function OpenAIAdsPreferencesButton() {
  const { locale } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isOpenAIAdsEnabled());
  }, []);

  if (!enabled) return null;

  return (
    <button
      type="button"
      className={styles.preferences}
      onClick={() => window.dispatchEvent(new Event(PREFERENCES_EVENT))}
    >
      {locale === "vi"
        ? "Lựa chọn đo lường quảng cáo"
        : "Ad measurement choices"}
    </button>
  );
}

export function OpenAIAdsConsent() {
  const { locale } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [privacyControl, setPrivacyControl] = useState(false);

  useEffect(() => {
    if (!isOpenAIAdsEnabled()) return;
    setPrivacyControl(
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl === true,
    );
    setVisible(getOpenAIAdsConsent() === null);
    initializeOpenAIAds();

    const open = (): void => setVisible(true);
    const changed = (): void => setVisible(false);
    const syncConsent = (): void => {
      initializeOpenAIAds();
      setPrivacyControl(
        (navigator as Navigator & { globalPrivacyControl?: boolean })
          .globalPrivacyControl === true,
      );
    };
    const storageChanged = (event: StorageEvent): void => {
      if (event.key !== null && event.key !== "saint6:openai-ads-consent:v1") {
        return;
      }
      syncConsent();
      setVisible(getOpenAIAdsConsent() === null);
    };
    window.addEventListener(PREFERENCES_EVENT, open);
    window.addEventListener("saint6:openai-ads-consent", changed);
    window.addEventListener("storage", storageChanged);
    window.addEventListener("focus", syncConsent);
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, open);
      window.removeEventListener("saint6:openai-ads-consent", changed);
      window.removeEventListener("storage", storageChanged);
      window.removeEventListener("focus", syncConsent);
    };
  }, []);

  const choose = (granted: boolean): void => {
    setOpenAIAdsConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className={styles.panel}
      aria-labelledby="ad-measurement-heading"
      aria-describedby="ad-measurement-description"
    >
      <div className={styles.copy}>
        <h2 id="ad-measurement-heading">
          {locale === "vi"
            ? "Đo lường quảng cáo tùy chọn"
            : "Optional ad measurement"}
        </h2>
        <p id="ad-measurement-description">
          {locale === "vi"
            ? "Cho phép OpenAI dùng cookie và mã nhận diện, có thể bao gồm thông tin liên hệ đã băm, để đo lường yêu cầu thuê studio từ quảng cáo? Bạn vẫn có thể gửi yêu cầu nếu từ chối."
            : "Allow OpenAI to use cookies and identifiers, which may include hashed contact details, to measure studio enquiries from ads? You can still enquire if you decline."}
        </p>
        <a
          href={`/website-privacy.html${locale === "vi" ? "#vietnamese" : "#openai"}`}
        >
          {locale === "vi" ? "Thông tin quyền riêng tư" : "Privacy information"}
        </a>
        {privacyControl && (
          <p>
            {locale === "vi"
              ? "Trình duyệt của bạn đã yêu cầu không đo lường quảng cáo. Chúng tôi tôn trọng lựa chọn này."
              : "Your browser has requested no ad measurement. We respect that choice."}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose(false)}>
          {locale === "vi" ? "Từ chối" : "Decline"}
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          disabled={privacyControl}
        >
          {locale === "vi" ? "Cho phép" : "Allow"}
        </button>
      </div>
    </aside>
  );
}
