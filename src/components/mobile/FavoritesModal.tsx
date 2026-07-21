"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getCategoryBySlug } from "@/lib/taxonomy";
// Sync seed lookup (not lib/data.ts's async Sanity-aware version) since this needs to
// resolve synchronously during render of a client component's list.
import { getProductBySlug } from "@/lib/products";
import { productPath } from "@/lib/paths";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { Button } from "../ui/Button";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";

export function FavoritesModal({
  locale,
  open,
  onClose,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}) {
  const dict = getDictionary(locale);
  const { items, remove } = useFavorites();
  const { add: addToCart } = useCart();

  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
      <div className="flex items-center justify-between border-b border-line p-4">
        <h2 className="font-heading text-h3 font-semibold text-navy">{dict.favorites.heading}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.search.closeLabel}
          className="grid size-11 place-items-center text-navy"
        >
          <X className="size-6" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <Heart className="size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm text-muted">{dict.favorites.empty}</p>
          </div>
        ) : (
          <ul>
            {items.map((item) => {
              const category = getCategoryBySlug("mne", item.categorySlug);
              const href = productPath(locale, category?.slug[locale] ?? item.categorySlug, item.slug);
              const product = getProductBySlug(item.categorySlug, item.slug);
              return (
                <li key={item.id} className="flex gap-3 border-b border-line p-4">
                  <Link href={href} onClick={onClose} className="relative size-16 shrink-0 overflow-hidden rounded-button border border-line bg-warehouse">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                    ) : (
                      <ProductImagePlaceholder alt={item.name} icon={category?.icon} className="size-full" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <Link href={href} onClick={onClose} className="text-sm font-semibold text-navy">
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-between gap-2">
                      {product && (
                        <Button
                          variant="accent"
                          size="md"
                          className="h-8 px-3 text-xs"
                          onClick={() => addToCart(product, dict.featured.addedToCart)}
                        >
                          {dict.featured.addToCart}
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-sm font-semibold text-muted underline-offset-2 hover:text-error hover:underline"
                      >
                        {dict.favorites.remove}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
