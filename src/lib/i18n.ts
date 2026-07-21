export const locales = ["mne", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "mne";

/** Matches the CMS product model's paired-field pattern (title_mne / title_en). */
export interface Localized {
  mne: string;
  en: string;
}

export function t(value: Localized, locale: Locale): string {
  return value[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "mne" ? "en" : "mne";
}

/** For client components mounted above the per-route locale (e.g. the root layout's global mobile chrome), derived from the URL rather than passed as a prop — mirrors the /en prefix convention in lib/paths.ts. */
export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "mne";
}
