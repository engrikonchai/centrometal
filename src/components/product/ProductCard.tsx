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

  const { add: addToCart } = useCart();
  const { toggle: toggleFavorite, isFavorited } = useFavorites();
  const favorited = isFavorited(cartItemId(product));

  // On-sale takes precedence over "new" so the badge matches the section a card
  // most likely appears in; only one badge ever shows.
  const badge = product.onSale
    ? { label: dict.featured.onSaleBadge, className: "bg-teal" }
    : product.isNew
      ? { label: dict.featured.newBadge, className: "bg-navy" }
      : null;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden hover:shadow-xl">
      <div className="relative">
        {badge && (
          <span
            className={clsx(
              "absolute left-2 top-2 z-10 rounded-full px-3 py-1 text-[11px] font-semibold uppercase leading-none tracking-tight text-white shadow-md",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        )}
        {/* Heart is its own control, kept outside the image <Link>. */}
        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-pressed={favorited}
          aria-label={favorited ? dict.featured.removeFromFavorites : dict.featured.addToFavorites}
          className={clsx(
            "absolute right-2 top-2 z-10 grid size-9 place-items-center rounded-full bg-white/80 backdrop-blur-sm transition hover:bg-white",
            favorited ? "text-teal" : "text-muted",
          )}
        >
          <Heart className="size-5" strokeWidth={2} fill={favorited ? "currentColor" : "none"} aria-hidden="true" />
        </button>

        <Link href={href} aria-label={product.name} data-testid="product-result" className="block">
          {product.image || product.localImage ? (
            <div className="relative aspect-square w-full overflow-hidden bg-warehouse">
              <Image
                src={
                  product.image
                    ? urlForImage(product.image).width(640).height(640).fit("crop").auto("format").url()
                    : product.localImage!
                }
                alt={alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-contain p-3 transition duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <ProductImagePlaceholder alt={alt} icon={category?.icon} className="aspect-square w-full" />
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <Link href={href} className="flex flex-col gap-1">
          {brand && (
            <BrandMark
              name={brand.name}
              logo={brand.logo}
              className="self-start px-1.5 py-0.5 text-[11px] sm:px-2 sm:py-1 sm:text-xs"
            />
          )}
          <h3 className="line-clamp-2 font-heading text-[0.95rem] font-semibold leading-tight text-navy sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-3">
          <p className="text-sm font-bold text-teal">{dict.featured.priceOnRequest}</p>
          <button
            type="button"
            onClick={() => addToCart(product, dict.featured.addedToCart)}
            className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-button bg-teal text-label font-semibold uppercase tracking-wide text-white transition hover:brightness-90 active:brightness-75"
          >
            <ShoppingCart className="size-4" strokeWidth={2} aria-hidden="true" />
            {dict.featured.addToCart}
          </button>
          <Link
            href={href}
            className="mt-2 flex min-h-11 w-full items-center justify-center rounded-button border border-teal text-label font-semibold uppercase tracking-wide text-teal transition hover:bg-teal hover:text-white active:brightness-90"
          >
            {dict.featured.viewDetails}
          </Link>
        </div>
      </div>
    </Card>
  );
}
