"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { productPath } from "@/lib/paths";
import { useCart } from "@/contexts/CartContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { Button } from "../ui/Button";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";

export function CartModal({
  locale,
  open,
  onClose,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}) {
  const dict = getDictionary(locale);
  const { items, remove, updateQuantity } = useCart();

  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
      <div className="flex items-center justify-between border-b border-line p-4">
        <h2 className="font-heading text-h3 font-semibold text-navy">{dict.cart.heading}</h2>
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
            <ShoppingCart className="size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm text-muted">{dict.cart.empty}</p>
          </div>
        ) : (
          <ul>
            {items.map((item) => {
              const category = getCategoryBySlug("mne", item.categorySlug);
              const href = productPath(locale, category?.slug[locale] ?? item.categorySlug, item.slug);
              return (
                <li key={item.id} className="flex gap-3 border-b border-line p-4">
                  <Link href={href} onClick={onClose} className="relative size-16 shrink-0 overflow-hidden rounded-button border border-line bg-warehouse">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                    ) : (
                      <ProductImagePlaceholder alt={item.name} icon={category?.icon} className="size-full" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <Link href={href} onClick={onClose} className="text-sm font-semibold text-navy">
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`${dict.cart.quantityLabel} -1`}
                          className="grid size-8 place-items-center rounded-button border border-line text-navy"
                        >
                          <Minus className="size-3.5" strokeWidth={2} aria-hidden="true" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`${dict.cart.quantityLabel} +1`}
                          className="grid size-8 place-items-center rounded-button border border-line text-navy"
                        >
                          <Plus className="size-3.5" strokeWidth={2} aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-sm font-semibold text-muted underline-offset-2 hover:text-error hover:underline"
                      >
                        {dict.cart.remove}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-line p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button variant="primary" size="lg" className="w-full" disabled title={dict.cart.checkoutComingSoon}>
            {dict.cart.checkout}
          </Button>
          <p className="mt-2 text-center text-xs text-muted">{dict.cart.checkoutComingSoon}</p>
        </div>
      )}
    </div>
  );
}
