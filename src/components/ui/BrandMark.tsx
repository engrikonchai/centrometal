import { clsx } from "clsx";

/**
 * Text-wordmark stand-in for a brand logo image. No real logo assets exist
 * yet (see brief's "Known open item") — swap for a Sanity image once brand
 * logos are uploaded, without changing where this component is used.
 */
export function BrandMark({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
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
