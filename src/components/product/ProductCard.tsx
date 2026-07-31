import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { getBrandBySlug } from "@/lib/brands";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { productPath } from "@/lib/paths";
import { getDictionary } from "@/lib/dictionary";
import { urlForImage } from "@/sanity/lib/image";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";
import { AddToInquiryButton } from "./AddToInquiryButton";

/**
 * Handoff product card, used by the home "Iz ponude" rail and the category
 * grid: image panel with badge, then brand logo, name, an optional
 * subcategory line, "Cijena na upit", and a full-width "Dodaj u upit" CTA
 * pinned to the bottom.
 *
 * Deliberately not a client component — the only interactive part is
 * AddToInquiryButton, which is its own client island. That lets the card
 * render on the server wherever its parent does.
 *
 * The design file wraps the whole card in an <a> with a <button> inside it;
 * that is invalid HTML and breaks keyboard use, so the link is scoped to the
 * image and title and the CTA sits outside it.
 */
export function ProductCard({
  product,
  locale,
  /** The category grid adds a subcategory line the home rail omits. */
  showSubcategory = false,
  className,
}: {
  product: Product;
  locale: Locale;
  showSubcategory?: boolean;
  className?: string;
}) {
  const brand = getBrandBySlug(product.brandSlug);
  const category = getCategoryBySlug("mne", product.categorySlug);
  const dict = getDictionary(locale);
  const href = productPath(locale, category?.slug[locale] ?? product.categorySlug, product.slug);
  const alt = `${brand?.name ?? ""} ${product.name}`.trim();

  const subcategory = category?.subcategories.find(
    (sub) => sub.slug.mne === product.subcategorySlug,
  );

  // Only one badge ever shows; on-sale wins so the badge matches the feed the
  // card most likely appears in.
  const badge = product.onSale
    ? dict.featured.onSaleBadge
    : product.isNew
      ? dict.featured.newBadge
      : null;

  return (
    <div
      className={clsx(
        /* Mobile: white card lifted off the #f2f2f7 page with a soft shadow.
           Tablet and desktop: the page is white, so the card inverts to a
           #f5f6f7 fill with no shadow and a slightly larger radius. */
        "flex flex-col overflow-hidden rounded-card bg-surface shadow-card",
        "md:rounded-[20px] md:bg-fill md:shadow-none",
        className,
      )}
    >
      <div className="relative bg-[#f7f7f9] md:bg-transparent">
        {badge && (
          <span className="absolute left-[9px] top-[9px] z-10 rounded-full bg-teal/95 px-2 py-[3px] text-[0.65625rem] font-semibold text-white md:left-3 md:top-3 md:px-2.5 md:py-[5px] md:text-[0.71875rem]">
            {badge}
          </span>
        )}
        {/* The design draws a wishlist heart here, but no screen in the bundle
            provides a favorites view to reach from it — the feature was cut
            rather than left pointing nowhere. */}

        <Link href={href} aria-label={product.name} data-testid="product-result" className="block">
          {product.image || product.localImage ? (
            <div className="relative aspect-square w-full">
              <Image
                src={
                  product.image
                    ? urlForImage(product.image).width(640).height(640).fit("crop").auto("format").url()
                    : product.localImage!
                }
                alt={alt}
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 50vw"
                className="object-contain p-4 md:p-5 xl:p-[22px]"
              />
            </div>
          ) : (
            <ProductImagePlaceholder alt={alt} icon={category?.icon} className="aspect-square w-full" />
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-[5px] p-3 pt-[11px] md:gap-[5px] md:px-4 md:pb-4 md:pt-1 xl:gap-1.5 xl:pb-[18px]">
        {brand?.logo ? (
          /* Plain <img>: these logos are tiny, variable-ratio and already in
             /public, and next/image's `fill` would need a sized box that
             defeats the max-width-58/height-12 treatment the design uses. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-3 w-auto max-w-[58px] object-contain object-left opacity-75 md:h-[14px] md:max-w-[62px] md:opacity-70 xl:h-[13px] xl:max-w-[60px]"
          />
        ) : (
          brand && (
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">
              {brand.name}
            </span>
          )
        )}

        <Link
          href={href}
          className="text-[0.9375rem] font-semibold leading-[1.25] tracking-[-0.015em] md:text-[1.03125rem] xl:text-base"
        >
          {product.name}
        </Link>

        {showSubcategory && subcategory && (
          <p className="text-[0.8125rem] text-muted md:text-[0.875rem] xl:text-[0.84375rem]">
            {subcategory.name[locale]}
          </p>
        )}

        <p className="mb-0.5 text-[0.8125rem] font-medium text-muted md:mb-0 md:mt-0.5 md:text-[0.875rem] xl:mt-1 xl:text-[0.84375rem]">
          {dict.featured.priceOnRequest}
        </p>

        <div className="mt-auto pt-3 md:pt-3 xl:pt-2.5">
          <AddToInquiryButton
            product={product}
            locale={locale}
            size="sm"
            tone="darkOnDesktop"
          />
        </div>
      </div>
    </div>
  );
}
