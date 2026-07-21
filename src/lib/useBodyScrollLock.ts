"use client";

import { useEffect } from "react";

/** Prevents the page behind a full-screen overlay (mobile nav, search, cart, favorites) from scrolling while it's open. */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
