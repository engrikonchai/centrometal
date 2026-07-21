"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
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
import { Button } from "../ui/Button";
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
      <Link
        href={href}
        className="flex flex-1 flex-col"
        aria-label={product.name}
        data-testid="product-result"
      >
        {product.onSale && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-teal px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {dict.featured.onSaleBadge}
          </span>
        )}
        {product.image || product.localImage ? (
          <div className="relative aspect-[4/3] w-full border-b border-line bg-warehouse">
            <Image
              src={
                product.image
                  ? urlForImage(product.image).width(480).height(360).fit("crop").auto("format").url()
                  : product.localImage!
              }
              alt={alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-contain p-3"
            />
          </div>
        ) : (
          <ProductImagePlaceholder
            alt={alt}
            icon={category?.icon}
            className="aspect-[4/3] w-full border-b border-line"
          />
        )}
        <div className="flex flex-1 flex-col gap-1.5 p-4 pb-0">
          {brand && <BrandMark name={brand.name} logo={brand.logo} className="self-start px-2 py-1 text-xs" />}
          <h3 className="font-heading text-lg font-semibold leading-tight text-navy">
            {product.name}
          </h3>
          {specs.length > 0 ? (
            <ul className="mt-0.5 space-y-0.5 text-xs leading-normal text-muted">
              {specs.map((spec) => (
                <li key={spec.label[locale]}>
                  {spec.label[locale]}: {spec.value}
                </li>
              ))}
            </ul>
          ) : (
            <p className="line-clamp-2 text-sm text-muted">{product.description[locale]}</p>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product)}
        aria-pressed={favorited}
        aria-label={favorited ? dict.featured.removeFromFavorites : dict.featured.addToFavorites}
        className={clsx(
          "absolute right-2 top-2 z-10 grid size-9 place-items-center rounded-full bg-white/90 shadow transition hover:bg-white",
          favorited ? "text-teal" : "text-muted",
        )}
      >
        <Heart className="size-5" strokeWidth={2} fill={favorited ? "currentColor" : "none"} aria-hidden="true" />
      </button>

      <div className="p-4 pt-3">
        <Button
          type="button"
          variant="accent"
          size="lg"
          className="w-full"
          onClick={() => addToCart(product, dict.featured.addedToCart)}
        >
          {dict.featured.addToCart}
        </Button>
      </div>
    </Card>
  );
}
