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

/**
 * A department page pre-filtered to one subcategory (mega-menu / drawer links).
 * The `?sub=` value carries the locale-appropriate subcategory slug; the
 * CategoryBrowser resolves it back to the MNE slug it filters on.
 */
export function subcategoryPath(
  locale: Locale,
  categorySlug: string,
  subcategorySlug: string,
): string {
  return `${categoryPath(locale, categorySlug)}?sub=${encodeURIComponent(subcategorySlug)}`;
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

export function searchPath(locale: Locale, query?: string): string {
  const base = locale === "mne" ? "/proizvodi/pretraga" : "/en/products/search";
  const trimmed = query?.trim();
  return trimmed ? `${base}?q=${encodeURIComponent(trimmed)}` : base;
}

/** Search term is not carried across languages — see brief's cross-language rule. */
export function alternateSearchPath(locale: Locale): string {
  return searchPath(otherLocale(locale));
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
