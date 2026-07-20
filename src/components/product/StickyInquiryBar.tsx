"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";

/**
 * Mobile-only sticky inquiry CTA for the product detail page. Slides up into
 * view once the user scrolls past the product image/CTAs (~500px) and slides
 * back out near the top so it never covers the hero. Slide is transform-only
 * and disabled under prefers-reduced-motion (motion-reduce:*). Hidden state is
 * also inert (aria-hidden + not focusable) so it's skipped by AT and tab order.
 */
export function StickyInquiryBar({ href, label }: { href: string; label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={clsx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-3 backdrop-blur md:hidden",
        "shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        "transition-transform duration-300 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <Button href={href} variant="primary" size="lg" className="w-full" tabIndex={visible ? undefined : -1}>
        {label}
      </Button>
    </div>
  );
}
