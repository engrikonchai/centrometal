import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlForImage } from "@/sanity/lib/image";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";
import { ProductGalleryViewer } from "./ProductGalleryViewer";

/** Shared shell for the main image, so all three paths crop identically. */
const mainImageBox =
  "relative aspect-[1/0.86] w-full overflow-hidden rounded-hero bg-surface shadow-card " +
  "md:aspect-[1/0.9] md:rounded-[26px] md:bg-fill md:shadow-none xl:aspect-[1/0.86] xl:rounded-[28px]";

function toUrl(source: SanityImageSource | string, size: number): string {
  if (typeof source === "string") return source;
  return urlForImage(source).width(size).height(size).fit("crop").auto("format").url();
}

/**
 * Product gallery.
 *
 * Mobile and desktop show a single large image. Tablet adds the handoff's 4-up
 * thumbnail strip beneath it — but only for SKUs that actually have more than
 * one photo.
 *
 * No product in the catalog has a second photo today (see `additionalImages`
 * in lib/products.ts), so every SKU currently takes the single-image path and
 * the strip is dormant. The prototype fills its strip with photos of *other*
 * products; that is a mock, not data, and is not reproduced here.
 *
 * Stays a server component: the single-photo case needs no JS, and `icon` is a
 * Lucide component that can't be serialized to a client boundary. Only the
 * multi-photo case mounts the client viewer.
 */
export function ProductGallery({
  alt,
  icon,
  image,
  localImage,
  additionalImages,
}: {
  alt: string;
  icon?: LucideIcon;
  image?: SanityImageSource;
  localImage?: string;
  additionalImages?: (SanityImageSource | string)[];
}) {
  const primary: SanityImageSource | string | undefined = image ?? localImage;

  if (!primary) {
    return (
      <ProductImagePlaceholder
        alt={alt}
        icon={icon}
        className="aspect-[1/0.86] w-full rounded-hero md:aspect-square"
      />
    );
  }

  const photos = [primary, ...(additionalImages ?? [])];

  /* More than one photo: hand off to the client viewer, which owns the
     selected-thumbnail state. */
  if (photos.length > 1) {
    return (
      <ProductGalleryViewer
        alt={alt}
        photos={photos.map((photo) => toUrl(photo, 1000))}
        mainClassName={mainImageBox}
      />
    );
  }

  /* Single photo — the path every product takes today. A one-tile strip would
     only repeat the image above it, so it renders as a plain image card. */
  return (
    <div className={mainImageBox}>
      <Image
        src={toUrl(primary, 1000)}
        alt={alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-contain p-6 md:p-10 xl:p-14"
        priority
      />
    </div>
  );
}
