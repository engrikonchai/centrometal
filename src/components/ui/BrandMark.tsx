import { clsx } from "clsx";

/**
 * Renders a brand logo image when one exists locally, falling back to a
 * text wordmark otherwise (see brief's "Known open item") — swap for a
 * Sanity image once real logo assets are uploaded there.
 */
export function BrandMark({
  name,
  logo,
  className,
}: {
  name: string;
  logo?: string;
  className?: string;
}) {
  if (logo) {
    return (
      <span
        className={clsx(
          "inline-flex items-center justify-center rounded-button border border-line bg-surface px-3 py-2",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- variable-aspect-ratio local logos, not worth Image's width/height ceremony */}
        <img src={logo} alt={name} className="h-5 w-auto object-contain" />
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
