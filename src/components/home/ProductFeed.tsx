"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { getDictionary } from "@/lib/dictionary";
import { categoryPath } from "@/lib/paths";
import { categories } from "@/lib/taxonomy";
import { SegmentedControl } from "../ui/SegmentedControl";
import { ProductCard } from "../product/ProductCard";

type Feed = "sale" | "new";

/**
 * "Iz ponude" — a Popust/Novo segmented toggle over a horizontal scroll-snap
 * rail on mobile (170px cards) and tablet (232px cards), and a 5-column grid
 * on desktop.
 *
 * Tablet deliberately keeps the rail rather than promoting it to a grid: at
 * this width a 3-column grid of the same cards would be cramped, and swiping
 * is the better interaction on touch. The toggle moves up beside the heading,
 * where there is room for it.
 */
export function ProductFeed({
  onSale,
  isNew,
  locale,
}: {
  onSale: Product[];
  isNew: Product[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [feed, setFeed] = useState<Feed>("sale");

  const items = feed === "sale" ? onSale : isNew;
  if (onSale.length === 0 && isNew.length === 0) return null;

  /* "Vidi sve" has no all-products index to point at, so it goes to the
     department the current feed draws from most. */
  const viewAllHref = categoryPath(locale, categories[0].slug[locale]);

  return (
    <section className="pb-1">
      {/*
        One flex row at tablet: heading on the left, toggle and "Vidi sve" on
        the right, wrapping to a second line if the labels get long. Mobile
        keeps them stacked and desktop reverts to heading-above-toggle.
      */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 px-4 md:items-center md:gap-3.5 md:px-6 xl:items-baseline xl:px-0">
        <h2 className="text-h2 font-bold md:text-[1.75rem] md:tracking-[-0.03em] xl:text-h2-lg">
          {dict.home.feedHeading}
        </h2>

        <div className="flex items-center gap-4">
          <SegmentedControl
            label={dict.home.feedToggleLabel}
            value={feed}
            onChange={setFeed}
            segments={[
              { value: "sale", label: dict.home.feedSale },
              { value: "new", label: dict.home.feedNew },
            ]}
            className="hidden md:grid xl:hidden"
          />
          <Link
            href={viewAllHref}
            className="flex min-h-11 items-center whitespace-nowrap text-[0.9375rem] font-medium tracking-[-0.01em] text-teal-ink transition hover:text-teal-hover md:text-base md:font-semibold xl:min-h-0 xl:font-medium"
          >
            {dict.home.viewAll}
            <span className="hidden md:inline">&nbsp;→</span>
          </Link>
        </div>
      </div>

      {/* Mobile and desktop placement for the toggle; tablet renders its own
          copy inline with the heading above. */}
      <SegmentedControl
        label={dict.home.feedToggleLabel}
        value={feed}
        onChange={setFeed}
        segments={[
          { value: "sale", label: dict.home.feedSale },
          { value: "new", label: dict.home.feedNew },
        ]}
        className="mx-4 mt-3 md:hidden xl:mx-0 xl:mt-5 xl:grid xl:w-[320px]"
      />

      {/* Mobile + tablet: scroll-snap rail. */}
      <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 pt-1 md:mt-[18px] md:gap-3.5 md:px-6 md:pb-2 xl:hidden">
        {items.map((product) => (
          <ProductCard
            key={`${product.categorySlug}/${product.slug}`}
            product={product}
            locale={locale}
            className="w-[170px] shrink-0 snap-start md:w-[232px]"
          />
        ))}
      </div>

      {/* Desktop: 5-column grid. */}
      <div className="mt-6 hidden grid-cols-5 gap-5 xl:grid">
        {items.slice(0, 5).map((product) => (
          <ProductCard
            key={`${product.categorySlug}/${product.slug}`}
            product={product}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}
