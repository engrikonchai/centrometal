"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { getBrandBySlug } from "@/lib/brands";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { productPath } from "@/lib/paths";
import { getDictionary } from "@/lib/dictionary";
import { urlForImage } from "@/sanity/lib/image";
import { useCart, cartItemId } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Card } from "../ui/Card";
import { BrandMark } from "../ui/BrandMark";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";

export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const brand = getBrandBySlug(product.brandSlug);
  const category = getCategoryBySlug("mne", product.categorySlug);
  const dict = getDictionary(locale);
  const href = productPath(locale, category?.slug[locale] ?? product.categorySlug, product.slug);
  const alt = `${brand?.name ?? ""} ${product.name}`.trim();
  const specs = product.specs?.slice(0, 3) ?? [];

  const { add: addToCart } = useCart();
  const { toggle: toggleFavorite, isFavorited } = useFavorites();
  const favorited = isFavorited(cartItemId(product));

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden">
      {/*
        Badge + favorite sit in a top bar within the card's padding, above the
        inset image panel — so neither ever overlaps the product artwork
        (the root cause of the v1 overlap). Kept outside the <Link> so the
        heart stays its own control.
      */}
      <div className="flex items-start justify-between px-2 pt-2">
        {product.onSale ? (
          <span className="rounded-md bg-teal px-2.5 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-tight text-white shadow-sm">
            {dict.featured.onSaleBadge}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-pressed={favorited}
          aria-label={favorited ? dict.featured.removeFromFavorites : dict.featured.addToFavorites}
          className={clsx(
            "-mr-1 grid size-9 place-items-center rounded-full transition hover:bg-black/5",
            favorited ? "text-teal" : "text-muted",
          )}
        >
          <Heart className="size-5" strokeWidth={2} fill={favorited ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>

      <Link
        href={href}
        className="flex flex-1 flex-col"
        aria-label={product.name}
        data-testid="product-result"
      >
        {/*
          Image wrapper is the flex-grow element, so any extra card height (from
          equal-height stretching) inflates the IMAGE rather than opening a gap
          of white space below the specs. min-h keeps it dominant even on the
          shortest card. 8px gutter (px-2) + a small inner inset.
        */}
        <div className="flex flex-1 px-2 pt-1">
          {product.image || product.localImage ? (
            <div className="relative min-h-[240px] w-full flex-1 overflow-hidden rounded-lg bg-warehouse">
              <Image
                src={
                  product.image
                    ? urlForImage(product.image).width(640).height(640).fit("crop").auto("format").url()
                    : product.localImage!
                }
                alt={alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-contain p-1.5"
              />
            </div>
          ) : (
            <ProductImagePlaceholder
              alt={alt}
              icon={category?.icon}
              className="min-h-[240px] w-full flex-1 rounded-lg"
            />
          )}
        </div>

        <div className="flex flex-col gap-1 px-3 pb-1 pt-2">
          {brand && <BrandMark name={brand.name} logo={brand.logo} className="self-start px-2 py-1 text-xs" />}
          <h3 className="line-clamp-2 font-heading text-base font-semibold leading-tight text-navy">
            {product.name}
          </h3>
          {specs.length > 0 ? (
            <ul className="space-y-0 text-[11px] leading-tight text-muted">
              {specs.map((spec) => (
                <li key={spec.label[locale]} className="line-clamp-1">
                  {spec.label[locale]}: {spec.value}
                </li>
              ))}
            </ul>
          ) : (
            <p className="line-clamp-2 text-[11px] leading-tight text-muted">{product.description[locale]}</p>
          )}
        </div>
      </Link>

      <div className="flex justify-end px-3 pb-3 pt-1">
        <button
          type="button"
          onClick={() => addToCart(product, dict.featured.addedToCart)}
          aria-label={dict.featured.addToCart}
          title={dict.featured.addToCart}
          className="grid size-11 place-items-center rounded-button bg-teal text-white transition hover:brightness-90 active:brightness-75"
        >
          <ShoppingCart className="size-5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}
