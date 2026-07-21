"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { resolveProductImageUrl } from "@/lib/productImage";
import { cartItemId } from "./CartContext";

const STORAGE_KEY = "centrometal_favorites";

export interface FavoriteItem {
  id: string;
  name: string;
  image?: string;
  categorySlug: string;
  slug: string;
  addedAt: number;
}

interface FavoritesContextValue {
  items: FavoriteItem[];
  count: number;
  add: (product: Product) => void;
  remove: (id: string) => void;
  toggle: (product: Product) => void;
  isFavorited: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Deferred (rather than called synchronously in the effect body) to satisfy
    // react-hooks/set-state-in-effect — same pattern SearchBox.tsx uses for its debounce.
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw) as FavoriteItem[]);
      } catch {
        // Corrupt/unavailable storage — start from an empty list.
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((product: Product) => {
    const id = cartItemId(product);
    setItems((current) => {
      if (current.some((item) => item.id === id)) return current;
      return [
        ...current,
        {
          id,
          name: product.name,
          image: resolveProductImageUrl(product),
          categorySlug: product.categorySlug,
          slug: product.slug,
          addedAt: Date.now(),
        },
      ];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const isFavorited = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const toggle = useCallback(
    (product: Product) => {
      const id = cartItemId(product);
      if (isFavorited(id)) {
        remove(id);
      } else {
        add(product);
      }
    },
    [add, remove, isFavorited],
  );

  const count = items.length;

  return (
    <FavoritesContext.Provider value={{ items, count, add, remove, toggle, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
