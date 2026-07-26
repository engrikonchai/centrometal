import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { format, getDictionary } from "@/lib/dictionary";
import { brandsPath, contactPath, homePath, servicePath, wholesalePath } from "@/lib/paths";
import {
  EMAIL,
  HQ_ADDRESS,
  LEGAL_NAME,
  SALES_PHONE,
  mailHref,
  telHref,
} from "@/lib/contact";
import { Container } from "../ui/Container";

/**
 * Handoff footer, two quite different shapes:
 *
 * - Mobile: an "Informacije" stack of individual white cards (explicitly not
 *   divided list rows) followed by a single "Kontakt" card.
 * - Desktop: four link columns on white with a hairline top rule.
 *
 * The footer is no longer a dark navy slab — the redesign keeps the whole
 * page light and reserves the dark gradient for featured/CTA cards.
 *
 * Contrast note: the design file sets column headings to rgba(60,60,67,0.55)
 * and addresses/hours to rgba(60,60,67,0.7), which composite to 3.0:1 and
 * 4.0:1 on white and fail AA at 13-14.5px. Both use --color-muted (5.9:1).
 */
export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  /* "O nama" now lives as a section on the contact page. */
  const aboutHref = `${contactPath(locale)}#o-nama`;

  const infoLinks = [
    { label: dict.nav.wholesale, href: wholesalePath(locale) },
    { label: dict.nav.service, href: servicePath(locale) },
    { label: dict.nav.about, href: aboutHref },
  ];

  const companyLinks = [
    { label: dict.nav.brands, href: brandsPath(locale) },
    ...infoLinks,
    { label: dict.nav.contact, href: contactPath(locale) },
  ];

  const hours = [
    `${dict.contactPage.hoursWeekdays} ${dict.contactPage.hoursWeekdaysValue}`,
    `${dict.contactPage.hoursSaturday} ${dict.contactPage.hoursSaturdayValue}`,
    `${dict.contactPage.hoursSunday} ${dict.contactPage.hoursSundayValue}`,
  ];

  const copyright = format(dict.contactPage.copyrightTemplate, {
    year,
    company: LEGAL_NAME,
  });

  return (
    <footer className="mt-2 lg:mt-16 lg:border-t lg:border-navy/[0.06]">
      {/* Mobile: card stack. */}
      <div className="px-4 pb-7 lg:hidden">
        <h2 className="mb-2.5 text-h2 font-bold">{dict.home.infoHeading}</h2>
        <div className="flex flex-col gap-2">
          {infoLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between gap-2.5 rounded-button bg-surface px-4 py-[15px] text-base font-medium tracking-[-0.015em] text-ink shadow-card"
            >
              {link.label}
              <ArrowUpRight className="size-4 shrink-0 text-teal-ink" strokeWidth={2.1} aria-hidden="true" />
            </Link>
          ))}
        </div>

        <h2 className="mb-2.5 mt-6 text-h2 font-bold">{dict.home.contactHeading}</h2>
        <div className="rounded-button bg-surface p-4 shadow-card">
          <p className="text-base tracking-[-0.015em]">{HQ_ADDRESS}</p>
          <a
            href={telHref(SALES_PHONE)}
            className="mt-2 block text-base font-semibold tracking-[-0.015em] text-teal-ink"
          >
            {SALES_PHONE}
          </a>
          <a
            href={mailHref}
            className="mt-1 block text-base font-semibold tracking-[-0.015em] text-teal-ink"
          >
            {EMAIL}
          </a>
        </div>

        <p className="mt-5 text-center text-[0.78125rem] text-muted">{copyright}</p>
      </div>

      {/* Desktop: four columns. */}
      <div className="hidden lg:block">
        <Container className="grid grid-cols-4 gap-8 py-14">
          <div>
            <Link href={homePath(locale)} className="text-xl font-bold tracking-[-0.02em] text-ink">
              Centro<span className="text-teal-ink">metal</span>
            </Link>
            <p className="mt-3 max-w-xs text-[0.90625rem] text-muted">
              {locale === "mne"
                ? "Ovlašćeni distributer alata, mašina i opreme u Podgorici, Crna Gora."
                : "Authorized distributor of tools, machinery and equipment in Podgorica, Montenegro."}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-muted">
              {dict.footer.companyHeading}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.90625rem] text-ink transition hover:text-teal-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-muted">
              {dict.footer.contactHeading}
            </h2>
            <ul className="flex flex-col gap-2.5 text-[0.90625rem]">
              <li>
                <a href={telHref(SALES_PHONE)} className="text-ink transition hover:text-teal-ink">
                  {SALES_PHONE}
                </a>
              </li>
              <li>
                <a href={mailHref} className="text-ink transition hover:text-teal-ink">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal-ink" strokeWidth={2} aria-hidden="true" />
                {HQ_ADDRESS}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-muted">
              {dict.footer.hoursHeading}
            </h2>
            <ul className="flex flex-col gap-2.5 text-[0.90625rem] text-muted">
              {hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </Container>

        <p className="border-t border-navy/[0.06] px-8 py-5 text-center text-[0.8125rem] text-muted">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
