"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

export interface HeroSlide {
  src: string;
  alt: string;
}

const AUTOPLAY_MS = 4000;
/** Brief: autoplay is disabled below 768px (save battery, let users tap dots). */
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Featured-product hero carousel. Slide-left transition (new image slides in
 * from the right) is CSS-driven via a translateX track in globals.css, so
 * prefers-reduced-motion and the mobile timing tweak live there and can never
 * flash. Autoplay runs only on desktop widths and only when the carousel isn't
 * hovered/focused. Only the current + next images are eagerly loaded; the rest
 * stay lazy to save bandwidth on slow connections.
 */
export function HeroCarousel({
  slides,
  label,
}: {
  slides: HeroSlide[];
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const [canAutoplay, setCanAutoplay] = useState(false);
  const pausedRef = useRef(false);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const mq = window.matchMedia(DESKTOP_QUERY);
    const apply = () => setCanAutoplay(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [count]);

  useEffect(() => {
    if (!canAutoplay || count <= 1) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [canAutoplay, count]);

  if (count === 0) return null;

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const nextIndex = (index + 1) % count;

  return (
    <div
      className="hero-carousel relative isolate aspect-[4/3]"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={() => {
        pausedRef.current = false;
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="hero-carousel-track flex h-full w-full"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const isCurrent = i === index;
            // Slide 0 is the LCP candidate — priority handles its eager load.
            // Otherwise eager-load only the current + next slide.
            const eager = isCurrent || i === nextIndex;
            return (
              <div
                key={slide.src}
                className="relative h-full w-full shrink-0"
                aria-hidden={!isCurrent}
              >
                <Image
                  src={slide.src}
                  alt={isCurrent ? slide.alt : ""}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : eager ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-10 drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] sm:p-14"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(28,43,54,0.6) 65%, #1c2b36 100%)",
        }}
        aria-hidden="true"
      />

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Prethodni proizvod"
            className="absolute left-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sljedeći proizvod"
            className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white"
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>

          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Prikaži proizvod ${i + 1}`}
                aria-current={i === index}
                className="grid size-9 place-items-center"
              >
                <span
                  className={clsx(
                    "block h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-orange-on-dark" : "w-2 bg-white/40",
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
