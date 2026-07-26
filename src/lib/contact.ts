/**
 * Company contact constants. These were previously inlined as literals in
 * ContactPage/Footer; the redesign surfaces the same numbers on five screens
 * (header CTA, store cards, inquiry success state, category empty state,
 * product sticky bar) so they live in one place.
 *
 * Not localized — phone numbers, e-mail and the street address are the same
 * in both locales.
 */

export const SALES_PHONE = "+382 20 260 528";
export const MOBILE_PHONE = "+382 69 372 823";
export const EMAIL = "info@centrometal.me";

/** Bulevar 21. Maja 23 is the registered HQ, distinct from the two stores. */
export const HQ_ADDRESS = "Bulevar 21. Maja broj 23, 81000 Podgorica";

export const LEGAL_NAME = "Centrometal D.O.O.";

/** `tel:` needs the number without spaces. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export const mailHref = `mailto:${EMAIL}`;
