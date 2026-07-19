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
