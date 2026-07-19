import { otherLocale, type Locale } from "./i18n";

export function homePath(locale: Locale): string {
  return locale === "mne" ? "/" : "/en";
}

export function categoryPath(locale: Locale, categorySlug: string): string {
  return locale === "mne"
    ? `/proizvodi/${categorySlug}`
    : `/en/products/${categorySlug}`;
}

export function productPath(
  locale: Locale,
  categorySlug: string,
  productSlug: string,
): string {
  return `${categoryPath(locale, categorySlug)}/${productSlug}`;
}

export function brandsPath(locale: Locale): string {
  return locale === "mne" ? "/brendovi" : "/en/brands";
}

export function wholesalePath(locale: Locale): string {
  return locale === "mne" ? "/veleprodaja" : "/en/wholesale";
}

export function servicePath(locale: Locale): string {
  return locale === "mne" ? "/servis" : "/en/service";
}

export function aboutPath(locale: Locale): string {
  return locale === "mne" ? "/o-nama" : "/en/about";
}

export function contactPath(locale: Locale): string {
  return locale === "mne" ? "/kontakt" : "/en/contact";
}

/** The other locale's equivalent of the current path, for the language switcher + hreflang. */
export function alternateHomePath(locale: Locale): string {
  return homePath(locale === "mne" ? "en" : "mne");
}

export function alternateCategoryPath(
  locale: Locale,
  categorySlugMne: string,
  categorySlugEn: string,
): string {
  return locale === "mne"
    ? categoryPath("en", categorySlugEn)
    : categoryPath("mne", categorySlugMne);
}

const staticPagePaths = {
  brands: brandsPath,
  wholesale: wholesalePath,
  service: servicePath,
  about: aboutPath,
  contact: contactPath,
} as const;

/** The other locale's equivalent path for one of the simple static pages. */
export function otherLocalePathFor(
  locale: Locale,
  page: keyof typeof staticPagePaths,
): string {
  return staticPagePaths[page](otherLocale(locale));
}
