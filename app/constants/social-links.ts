/**
 * Social media links for Saint 6 Studio
 * Used across the site: header, footer, contact page, etc.
 */

export interface SocialLinkConfig {
  platform: string;
  url: string;
  label: string;
  shortLabel: string;
}

export const SOCIAL_LINKS: SocialLinkConfig[] = [
  {
    platform: "Facebook",
    url: "https://www.facebook.com/saint6studios/",
    label: "FACEBOOK",
    shortLabel: "FB",
  },
{
    platform: "Instagram",
    url: "https://www.instagram.com/saint6.studios/",
    label: "INSTAGRAM",
    shortLabel: "INST",
  },
  {
    platform: "TikTok",
    url: "https://www.tiktok.com/@saint6studios",
    label: "TIKTOK",
    shortLabel: "TIKTOK",
  },
];

// Helper to get a specific social link
export function getSocialLink(platform: string): SocialLinkConfig | undefined {
  return SOCIAL_LINKS.find(
    (link) => link.platform.toLowerCase() === platform.toLowerCase(),
  );
}
