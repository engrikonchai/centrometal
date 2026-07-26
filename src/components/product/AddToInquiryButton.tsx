"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Product } from "@/lib/products";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { useCart } from "@/contexts/CartContext";

/** Handoff: the confirmation state holds for ~2.2s, then reverts. */
const CONFIRM_MS = 2200;

/**
 * "Dodaj u upit" — adds the product to the inquiry list (CartContext) and
 * flips to a green "Dodato u upit ✓" state in place.
 *
 * The confirmation is deliberately local rather than CartContext's global
 * toast: the handoff shows the feedback *on the button*, and on the product
 * grid a toast can't tell you which of eight cards you just tapped. The
 * toast is suppressed here by not passing a message to `add()`.
 */
export function AddToInquiryButton({
  product,
  locale,
  size = "md",
  tone = "accent",
  className,
}: {
  product: Product;
  locale: Locale;
  /** sm = 36px grid-card button (40px at desktop), md = 48px sticky-bar button. */
  size?: "sm" | "md";
  /**
   * The desktop design fills the *card* CTA near-black while the product
   * detail CTA stays accent-teal, so the grid opts into `darkOnDesktop`.
   * Mobile is teal either way; the added-confirmation green wins over both.
   */
  tone?: "accent" | "darkOnDesktop";
  className?: string;
}) {
  const dict = getDictionary(locale);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  function handleClick() {
    add(product);
    setAdded(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setAdded(false), CONFIRM_MS);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      /* Announces the confirmation to screen readers, which otherwise get no
         signal that the tap did anything. */
      aria-live="polite"
      className={clsx(
        "flex w-full items-center justify-center gap-1.5 rounded-full font-semibold tracking-[-0.01em] text-white transition",
        size === "sm" ? "h-9 text-sm lg:h-10" : "h-12 text-[0.96875rem]",
        added
          ? "bg-green"
          : tone === "darkOnDesktop"
            ? "bg-teal hover:bg-teal-hover lg:bg-navy lg:hover:bg-navy lg:hover:brightness-125"
            : "bg-teal hover:bg-teal-hover",
        className,
      )}
    >
      {added ? dict.product.addedToInquiry : dict.product.addToInquiry}
    </button>
  );
}
