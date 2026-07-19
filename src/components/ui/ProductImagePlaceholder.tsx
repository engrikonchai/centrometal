import type { LucideIcon } from "lucide-react";
import { Package } from "lucide-react";
import { clsx } from "clsx";

/**
 * Stand-in for a product photo — no real product images exist yet (see
 * brief's "Known open item"). Swap for a Sanity image once photography is
 * available; alt text is still passed through so the eventual <Image />
 * swap needs no caller changes.
 */
export function ProductImagePlaceholder({
  alt,
  icon: Icon = Package,
  className,
}: {
  alt: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={clsx(
        "flex items-center justify-center bg-warehouse",
        className,
      )}
    >
      <Icon className="size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
