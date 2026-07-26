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

  return (
    <div>
      <p className="hidden text-[0.8125rem] font-semibold uppercase tracking-[0.05em] text-teal-ink lg:block">
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
      <h1 className="mb-4 mt-1 text-[2rem] font-bold leading-[1.25] lg:mb-0 lg:mt-3.5 lg:text-h1-lg lg:leading-[1.04]">
        {dict.hero.headline}
      </h1>

      <div className="flex items-center gap-2 text-[0.90625rem] text-muted lg:mt-4 lg:max-w-[460px] lg:text-lg">
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

      {/* Mobile: search sits in the hero. Desktop keeps it in the header. */}
      <SearchBox locale={locale} variant="inline" className="mt-3.5 w-full lg:hidden" />

      <div className="mt-7 hidden items-center gap-3 lg:flex">
        <a
          href={categoryPath(locale, categories[0].slug[locale])}
          className="inline-flex h-[52px] items-center rounded-[14px] bg-navy px-7 text-base font-semibold text-white transition hover:brightness-125"
        >
          {dict.hero.ctaPrimary}
        </a>
        <a
          href={telHref(SALES_PHONE)}
          className="inline-flex h-[52px] items-center gap-2 rounded-[14px] border-[1.5px] border-navy/15 px-6 text-base font-semibold text-navy transition hover:border-navy/30"
        >
          <Phone className="size-[17px] text-teal-ink" strokeWidth={2.1} aria-hidden="true" />
          {dict.nav.call}
        </a>
      </div>
    </div>
  );
}
