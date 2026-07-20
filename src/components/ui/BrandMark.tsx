import Image from "next/image";
import { clsx } from "clsx";

/**
 * Renders a brand logo image when one exists locally, falling back to a
 * text wordmark otherwise (see brief's "Known open item") — swap for a
 * Sanity image once real logo assets are uploaded there.
 *
 * Uses next/image with `fill` + object-contain inside a fixed 20px-tall,
 * capped-width box. The logos are variable aspect ratio and even
 * variable format (a couple are mislabelled .png but are actually JPEG /
 * WebP), so `fill` avoids per-file width/height bookkeeping and lets the
 * optimizer serve a ~40px asset instead of the multi-megapixel source.
 */
export function BrandMark({
  name,
  logo,
  className,
  imageClassName,
}: {
  name: string;
  logo?: string;
  className?: string;
  imageClassName?: string;
}) {
  if (logo) {
    return (
      <span
        className={clsx(
          "inline-flex items-center justify-center rounded-button border border-line bg-surface px-3 py-2",
          className,
        )}
      >
        {/* imageClassName sets the box size (height AND width) — object-contain
            on the Image itself fits the logo inside without distortion. Do not
            pass w-auto here: the box needs a real width for `fill` to fill. */}
        <span className={clsx("relative block", imageClassName ?? "h-5 w-10")}>
          <Image
            src={logo}
            alt={name}
            fill
            quality={95}
            sizes="80px"
            className="object-contain"
          />
        </span>
      </span>
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-button border border-line bg-surface " +
          "px-3 py-2 font-heading font-semibold uppercase tracking-wide text-navy",
        className,
      )}
    >
      {name}
    </span>
  );
}
