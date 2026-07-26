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
 * rail on mobile (170px cards) and a 5-column grid on desktop.
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
      <div className="flex items-baseline justify-between gap-3 px-4 lg:px-0">
        <h2 className="text-h2 font-bold lg:text-h2-lg">{dict.home.feedHeading}</h2>
        <Link
          href={viewAllHref}
          className="whitespace-nowrap text-[0.9375rem] font-medium tracking-[-0.01em] text-teal-ink transition hover:text-teal-hover"
        >
          {dict.home.viewAll}
          <span className="hidden lg:inline"> →</span>
        </Link>
      </div>

      <SegmentedControl
        label={dict.home.feedToggleLabel}
        value={feed}
        onChange={setFeed}
        segments={[
          { value: "sale", label: dict.home.feedSale },
          { value: "new", label: dict.home.feedNew },
        ]}
        className="mx-4 mt-3 lg:mx-0 lg:mt-5 lg:w-[320px]"
      />

      {/* Mobile: scroll-snap rail. */}
      <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 pt-1 lg:hidden">
        {items.map((product) => (
          <ProductCard
            key={`${product.categorySlug}/${product.slug}`}
            product={product}
            locale={locale}
            className="w-[170px] shrink-0 snap-start"
          />
        ))}
      </div>

      {/* Desktop: 5-column grid. */}
      <div className="mt-6 hidden grid-cols-5 gap-5 lg:grid">
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
