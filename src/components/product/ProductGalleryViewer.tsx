"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";

/** Thumbnails the strip shows before collapsing the rest into a "+N" tile. */
const THUMB_SLOTS = 4;

/**
 * The interactive half of the gallery: main image plus the tablet thumbnail
 * strip, for SKUs that have more than one photo.
 *
 * Split out of ProductGallery so the common single-photo case stays a server
 * component — this island only mounts when there is something to switch
 * between. It takes resolved URL strings rather than SanityImageSource objects
 * so nothing non-serializable crosses the boundary.
 */
export function ProductGalleryViewer({
  alt,
  photos,
  mainClassName,
}: {
  alt: string;
  photos: string[];
  mainClassName: string;
}) {
  const [active, setActive] = useState(0);
  const current = photos[Math.min(active, photos.length - 1)];

  const visible = photos.slice(0, THUMB_SLOTS);
  const overflow = photos.length - THUMB_SLOTS;

  return (
    <div className="flex flex-col gap-3">
      <div className={mainClassName}>
        <Image
          src={current}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain p-6 md:p-10 xl:p-14"
          priority
        />
      </div>

      {/*
        Tablet-only: mobile has no room for it beside a full-bleed image and
        the desktop design omits the strip entirely.
      */}
      <div className="hidden grid-cols-4 gap-2.5 md:grid xl:hidden">
        {visible.map((photo, index) => {
          /* Last slot becomes the counter when there are more photos than
             slots — it stands for this photo plus everything past the strip. */
          if (overflow > 0 && index === THUMB_SLOTS - 1) {
            return (
              <span
                key="overflow"
                aria-hidden="true"
                className="grid aspect-square place-items-center rounded-2xl bg-fill text-sm font-semibold text-muted"
              >
                +{overflow + 1}
              </span>
            );
          }
          const selected = index === active;
          return (
            <button
              key={photo}
              type="button"
              aria-label={`${alt} — ${index + 1}`}
              aria-current={selected ? "true" : undefined}
              onClick={() => setActive(index)}
              className={clsx(
                "grid aspect-square place-items-center overflow-hidden rounded-2xl bg-fill transition",
                selected
                  ? "border-2 border-teal"
                  : "border-2 border-transparent hover:bg-navy/[0.06]",
              )}
            >
              <Image
                src={photo}
                alt=""
                width={160}
                height={160}
                className="size-full object-contain p-2.5"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
