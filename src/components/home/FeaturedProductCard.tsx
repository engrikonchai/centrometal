"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { getDictionary } from "@/lib/dictionary";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { productPath } from "@/lib/paths";
import { urlForImage } from "@/sanity/lib/image";

/**
 * The dark gradient featured card that sits under the hero on mobile and
 * beside it on desktop.
 *
 * The design file draws a row of dots under the product, implying the card
 * cycles through the featured products — they are wired here as real controls
 * rather than decoration, since a static dot row would be a lie to anyone
 * using a screen reader. Each product renders as a full-width slide in a
 * scroll-snap track so the row can also be swiped/dragged, not just tapped.
 */
export function FeaturedProductCard({
  products,
  locale,
}: {
  products: Product[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const slide = track?.children[i] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, []);

  /* Dots track scroll position instead of driving it directly, so a swipe
     ends on the same active dot a tap would have produced. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || products.length <= 1) return;

    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = Math.round(track.scrollLeft / track.clientWidth);
        setIndex((prev) => (prev === next ? prev : next));
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [products.length]);

  if (products.length === 0) return null;

  return (
    <div className="gradient-dark overflow-hidden rounded-hero text-white shadow-lifted lg:rounded-[28px]">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, i) => {
          const category = getCategoryBySlug("mne", product.categorySlug);
          const subcategory = category?.subcategories.find(
            (sub) => sub.slug.mne === product.subcategorySlug,
          );
          const href = productPath(
            locale,
            category?.slug[locale] ?? product.categorySlug,
            product.slug,
          );

          const eyebrow = product.onSale
            ? `${dict.home.featuredEyebrow} · ${dict.featured.onSaleBadge}`
            : dict.home.featuredEyebrow;

          /* Mobile shows "Subcategory · Cijena na upit"; desktop swaps in the
             two headline specs when the product has them. */
          const specLine = (product.specs ?? [])
            .slice(0, 2)
            .map((spec) => spec.value)
            .join(" · ");
          const metaParts = [
            subcategory?.name[locale],
            specLine || dict.featured.priceOnRequest,
          ].filter(Boolean);

          const imageSrc = product.image
            ? urlForImage(product.image).width(640).height(640).fit("crop").auto("format").url()
            : product.localImage;

          return (
            <div
              key={product.slug}
              className="flex w-full shrink-0 snap-start items-center gap-3 p-[18px] pb-3.5 lg:block lg:p-10 lg:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[0.71875rem] font-bold uppercase tracking-[0.08em] text-teal-on-dark lg:text-[0.78125rem] lg:tracking-[0.06em]">
                  {eyebrow}
                </p>
                <p className="mt-1.5 text-balance text-[1.375rem] font-bold leading-[1.12] tracking-[-0.025em] lg:mt-2.5 lg:text-[1.875rem] lg:tracking-[-0.03em]">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-white/[0.62] lg:mt-1.5 lg:text-[0.9375rem] lg:text-white/[0.64]">
                  {metaParts.join(" · ")}
                </p>
                <Link
                  href={href}
                  className="mt-3 inline-flex h-[34px] items-center rounded-full bg-white px-3.5 text-sm font-semibold tracking-[-0.01em] text-[#16222c] transition hover:bg-white/90 lg:mt-[18px] lg:h-11 lg:rounded-xl lg:px-[22px] lg:text-[0.9375rem]"
                >
                  {dict.home.featuredCta}
                </Link>
              </div>

              {imageSrc && (
                <Image
                  src={imageSrc}
                  alt={product.name}
                  width={320}
                  height={320}
                  priority={i === 0}
                  className="h-28 w-[108px] shrink-0 object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)] lg:mx-auto lg:mt-3 lg:h-auto lg:w-80 lg:drop-shadow-[0_24px_28px_rgba(0,0,0,0.5)]"
                />
              )}
            </div>
          );
        })}
      </div>

      {products.length > 1 && (
        <div className="flex justify-center gap-[5px] pb-3.5 lg:pb-6">
          {products.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={item.name}
              aria-current={i === index}
              /* 6px dot inside a 24px hit area — the visible dot alone is far
                 below the minimum touch target. */
              className="grid size-6 place-items-center"
            >
              <span
                className={clsx(
                  "block size-1.5 rounded-full transition",
                  i === index ? "bg-white" : "bg-white/30",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
