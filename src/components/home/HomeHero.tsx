import { Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { SALES_PHONE, telHref } from "@/lib/contact";
import { SearchBox } from "../layout/SearchBox";

/**
 * Home hero.
 *
 * Mobile (per the design file): H1, a "30+ brendova · 2 lokacije · Sopstveni
 * servis" meta line, and a search field — no eyebrow and no CTA pair. The
 * handoff README describes an "eyebrow + H1 + meta + 2 CTAs" mobile hero, but
 * the file it points at has neither; the file wins here and the eyebrow/CTAs
 * appear only at desktop, which is where the file actually draws them.
 *
 * The mobile and desktop files also carry different H1 copy ("Alati, mašine i
 * oprema za svaki posao." vs "Alati i mašine za svaki posao."). Merging them
 * into one responsive component forces a single headline; this uses the
 * mobile wording, which is also what the existing dictionary already had.
 */
export function HomeHero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const meta = [
    dict.home.heroMetaBrands,
    dict.home.heroMetaLocations,
    dict.home.heroMetaService,
  ];

  /*
    Tablet stat strip. The handoff draws three stats here — "30+ brendova",
    "2 prodavnice" and "24h odgovor na upit". The first two are facts the site
    already states; the 24h response promise is not, and the handoff itself
    flags it as unconfirmed. Rather than publish an unbacked service-level
    claim, this uses the same confirmed trio the Kontakt page already ships
    (2 prodavnice / 30+ brendova / 1 servis). Swap the third entry for the
    response-time stat if the business confirms it.
  */
  const stats = [
    { value: dict.contactPage.statStoresValue, label: dict.contactPage.statStoresLabel },
    { value: dict.contactPage.statBrandsValue, label: dict.contactPage.statBrandsLabel },
    { value: dict.contactPage.statServiceValue, label: dict.contactPage.statServiceLabel },
  ];

  return (
    <div className="md:flex md:flex-col md:justify-center md:py-2">
      <p className="hidden text-[0.8125rem] font-semibold uppercase tracking-[0.05em] text-teal-ink md:block">
        {dict.hero.eyebrow}
      </p>

      {/*
        Mobile sizing is set explicitly rather than via the --text-h1 token
        (which PageHeader also uses) so this stays scoped to the hero.

        `text-wrap: balance` and the token's 1.08 line-height are both gone:
        at 34px/1.08 the leading is tighter than the font's own ascender +
        descender, which left only an 8px gap to the meta line and collapsed
        further on font stacks with different metrics — the overlap reported
        in design review. 32px/1.25 with an explicit 16px bottom margin is
        metric-independent. Desktop keeps its own scale.
      */}
      <h1 className="mb-4 mt-1 text-balance text-[2rem] font-bold leading-[1.25] md:mb-0 md:mt-3 md:text-[2.75rem] md:leading-[1.06] md:tracking-[-0.032em] xl:mt-3.5 xl:text-h1-lg xl:leading-[1.04] xl:tracking-[-0.033em]">
        {dict.hero.headline}
      </h1>

      <div className="flex items-center gap-2 text-[0.90625rem] text-muted md:mt-3.5 md:text-[1.09375rem] xl:mt-4 xl:max-w-[460px] xl:text-lg">
        {meta.map((item, i) => (
          <span key={item} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted/40">
                ·
              </span>
            )}
            {item}
          </span>
        ))}
      </div>

      {/* Mobile: search sits in the hero. Tablet and desktop keep it in the
          header, where it's full-width and always visible. */}
      <SearchBox locale={locale} variant="inline" className="mt-3.5 w-full md:hidden" />

      <div className="mt-[22px] hidden flex-wrap items-center gap-2.5 md:flex xl:mt-7 xl:flex-nowrap xl:gap-3">
        <a
          href={categoryPath(locale, categories[0].slug[locale])}
          className="inline-flex h-[52px] items-center rounded-[14px] bg-navy px-[26px] text-[1.03125rem] font-semibold text-white transition hover:brightness-125 xl:px-7 xl:text-base"
        >
          {dict.hero.ctaPrimary}
        </a>
        <a
          href={telHref(SALES_PHONE)}
          className="inline-flex h-[52px] items-center gap-2 rounded-[14px] border-[1.5px] border-navy/15 px-[22px] text-[1.03125rem] font-semibold text-navy transition hover:border-navy/30 xl:px-6 xl:text-base"
        >
          <Phone className="size-[17px] text-teal-ink" strokeWidth={2.1} aria-hidden="true" />
          {dict.nav.call}
        </a>
      </div>

      {/* Tablet-only stat strip above a hairline — desktop's hero uses the
          meta line alone and has no room for it beside the featured card. */}
      <dl className="mt-[26px] hidden flex-wrap gap-x-[22px] gap-y-3 border-t border-navy/[0.08] pt-5 md:flex xl:hidden">
        {stats.map((stat) => (
          /* Value reads above the label but the <dt> still precedes its <dd>
             in the DOM, so the pair is announced as "prodavnice: 2". */
          <div key={stat.label} className="flex flex-col-reverse">
            <dt className="mt-0.5 text-sm text-muted">{stat.label}</dt>
            <dd className="text-[1.375rem] font-bold tracking-[-0.02em]">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
