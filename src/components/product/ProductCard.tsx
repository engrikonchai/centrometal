"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MoreVertical, ShoppingCart } from "lucide-react";
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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Kebab menu — extensible: add more { label, href } items here later
  // (e.g. Podijeli / Share, Uporedi / Compare).
  const menuItems: { label: string; href: string }[] = [
    { label: dict.featured.viewDetails, href },
  ];

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
          <div className="mt-2 flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => addToCart(product, dict.featured.addedToCart)}
              aria-label={dict.featured.addToCart}
              title={dict.featured.addToCart}
              className="flex min-h-11 flex-1 items-center justify-center rounded-button bg-teal text-white transition hover:brightness-90 active:brightness-75"
            >
              <ShoppingCart className="size-5" strokeWidth={2} aria-hidden="true" />
            </button>
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={dict.featured.moreOptions}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="grid min-h-11 min-w-11 place-items-center rounded-button border border-line text-navy transition hover:border-teal hover:text-teal"
              >
                <MoreVertical className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute bottom-full right-0 z-20 mb-2 min-w-36 overflow-hidden rounded-button border border-line bg-white py-1 shadow-lg"
                >
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="block whitespace-nowrap px-4 py-2.5 text-sm text-ink transition hover:bg-warehouse"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
