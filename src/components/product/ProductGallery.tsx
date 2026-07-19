import type { LucideIcon } from "lucide-react";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";

/**
 * Single large image for now — no real product photography exists yet
 * (see brief's "Known open item"). Structurally this occupies the PDP's
 * gallery position so it becomes a real main-image + thumbnail-rail
 * gallery with no layout change once photos are uploaded to the CMS.
 */
export function ProductGallery({ alt, icon }: { alt: string; icon?: LucideIcon }) {
  return (
    <ProductImagePlaceholder
      alt={alt}
      icon={icon}
      className="aspect-square w-full rounded-button border border-line"
    />
  );
}
