// Local-storage backed site settings (admin-editable).
export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  supportEmail: string;
  phone: string;
  address: string;
  social: {
    instagram: string;
    tiktok: string;
    facebook: string;
    twitter: string;
    youtube: string;
    discord: string;
    telegram: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  features: {
    showCookieBanner: boolean;
    allowSignups: boolean;
    maintenanceMode: boolean;
  };
};

const KEY = "cinetv:site-settings";

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "CINE TV",
  tagline: "Stream into the cinematic universe",
  contactEmail: "islam.islam.arif333@gmail.com",
  supportEmail: "support@cinetv.local",
  phone: "",
  address: "",
  social: {
    instagram: "",
    tiktok: "",
    facebook: "",
    twitter: "",
    youtube: "",
    discord: "",
    telegram: "",
    linkedin: "",
  },
  seo: {
    metaTitle: "CINE TV — Discover Movies & TV Shows",
    metaDescription: "Discover trending movies and TV shows on CINE TV.",
    keywords: "movies, tv shows, trailers, reviews",
  },
  features: {
    showCookieBanner: true,
    allowSignups: true,
    maintenanceMode: false,
  },
};

export function getSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      social: { ...DEFAULT_SETTINGS.social, ...(parsed.social ?? {}) },
      seo: { ...DEFAULT_SETTINGS.seo, ...(parsed.seo ?? {}) },
      features: { ...DEFAULT_SETTINGS.features, ...(parsed.features ?? {}) },
    };
  } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(s: SiteSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("cinetv:settings"));
}

export function resetSettings() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("cinetv:settings"));
}
