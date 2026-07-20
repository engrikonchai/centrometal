"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

/**
 * Scroll-triggered fade/slide reveal. Fires once via IntersectionObserver;
 * actual motion (including the prefers-reduced-motion no-op) lives in the
 * .reveal CSS in globals.css so a slow observer callback can never cause a
 * flash of unstyled content.
 */
export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left";
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <As
      ref={ref}
      className={clsx("reveal", variant === "left" && "reveal-left", visible && "is-visible", className)}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </As>
  );
}
