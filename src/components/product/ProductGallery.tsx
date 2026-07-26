import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlForImage } from "@/sanity/lib/image";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";

/**
 * Single large image for now (no thumbnail rail) — real product photos are
 * one image per product so far. Structurally this occupies the PDP's
 * gallery position so it becomes a real thumbnail-rail gallery with no
 * layout change once a product has more than one photo in the CMS.
 */
export function ProductGallery({
  alt,
  icon,
  image,
  localImage,
}: {
  alt: string;
  icon?: LucideIcon;
  image?: SanityImageSource;
  localImage?: string;
}) {
  if (image || localImage) {
    return (
      <div className="relative aspect-[1/0.86] w-full overflow-hidden rounded-hero bg-surface shadow-card lg:rounded-[28px] lg:bg-fill lg:shadow-none">
        <Image
          src={
            image
              ? urlForImage(image).width(1000).height(1000).fit("crop").auto("format").url()
              : localImage!
          }
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-6 lg:p-14"
          priority
        />
      </div>
    );
  }

  return (
    <ProductImagePlaceholder
      alt={alt}
      icon={icon}
      className="aspect-[1/0.86] w-full rounded-hero lg:aspect-square"
    />
  );
}
