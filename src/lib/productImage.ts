import type { Product } from "./products";
import { urlForImage } from "@/sanity/lib/image";

/**
 * Resolves a product's image to a plain URL string, for contexts (cart/favorites
 * localStorage entries) that need something JSON-serializable rather than a live
 * SanityImageSource + <Image> pairing. Same crop/size ProductCard uses for its grid thumbnail.
 */
export function resolveProductImageUrl(product: Product): string | undefined {
  if (product.image) {
    return urlForImage(product.image).width(480).height(360).fit("crop").auto("format").url();
  }
  return product.localImage;
}
