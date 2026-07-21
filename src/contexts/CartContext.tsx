"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Product } from "@/lib/products";
import { resolveProductImageUrl } from "@/lib/productImage";

const STORAGE_KEY = "centrometal_cart";
const TOAST_DURATION_MS = 2400;

export interface CartItem {
  id: string;
  name: string;
  image?: string;
  categorySlug: string;
  slug: string;
  quantity: number;
  addedAt: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  hydrated: boolean;
  add: (product: Product, toastMessage?: string) => void;
  remove: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isInCart: (id: string) => boolean;
  clear: () => void;
}

/** Product.slug is only unique within its category, not globally — matches the productPath() URL segments. */
export function cartItemId(product: Pick<Product, "categorySlug" | "slug">): string {
  return `${product.categorySlug}/${product.slug}`;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Deferred (rather than called synchronously in the effect body) to satisfy
    // react-hooks/set-state-in-effect — same pattern SearchBox.tsx uses for its debounce.
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        // Corrupt/unavailable storage — start from an empty cart.
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  const add = useCallback((product: Product, toastMessage?: string) => {
    const id = cartItemId(product);
    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...current,
        {
          id,
          name: product.name,
          image: resolveProductImageUrl(product),
          categorySlug: product.categorySlug,
          slug: product.slug,
          quantity: 1,
          addedAt: Date.now(),
        },
      ];
    });
    if (toastMessage) {
      setToastMessage(toastMessage);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    }
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) return current.filter((item) => item.id !== id);
      return current.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  }, []);

  const isInCart = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, hydrated, add, remove, updateQuantity, isInCart, clear }}
    >
      {children}
      <div
        aria-live="polite"
        className={clsx(
          "pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex justify-center px-4 transition-opacity duration-300 lg:bottom-6",
          toastMessage ? "opacity-100" : "opacity-0",
        )}
      >
        {toastMessage && (
          <div className="rounded-button bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
