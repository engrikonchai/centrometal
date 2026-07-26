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

/*
  aboutPath is gone: "O nama" is now a #o-nama section on the contact page,
  and /o-nama + /en/about are 308 redirects (see next.config.ts). Callers that
  want the About content link to `${contactPath(locale)}#o-nama`.
*/

export function contactPath(locale: Locale): string {
  return locale === "mne" ? "/kontakt" : "/en/contact";
}

/**
 * The merged inquiry form — the single conversion path that replaces the
 * separate contact/wholesale/service forms. `type` preselects the segmented
 * control so the Veleprodaja and Servis pages can deep-link into it.
 */
export function inquiryPath(locale: Locale, type?: InquiryType): string {
  const base = locale === "mne" ? "/upit" : "/en/inquiry";
  return type ? `${base}?type=${type}` : base;
}

export type InquiryType = "kupovina" | "veleprodaja" | "servis";

/**
 * Resolves the `?type=` search param to an inquiry type, defaulting to
 * Kupovina. Lives here rather than in the form so the page can resolve it on
 * the server and pass it down — see the note in InquiryPage about why the
 * form no longer reads it via useSearchParams.
 */
export function parseInquiryType(value: string | string[] | undefined): InquiryType {
  return value === "veleprodaja" || value === "servis" ? value : "kupovina";
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
  contact: contactPath,
} as const;

/** The other locale's equivalent path for one of the simple static pages. */
export function otherLocalePathFor(
  locale: Locale,
  page: keyof typeof staticPagePaths,
): string {
  return staticPagePaths[page](otherLocale(locale));
}
