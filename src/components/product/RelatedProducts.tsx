import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import type { Product } from "@/lib/products";
import { getBrandBySlug } from "@/lib/brands";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { categoryPath, productPath } from "@/lib/paths";
import { urlForImage } from "@/sanity/lib/image";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";

/**
 * "Slični proizvodi" — a scroll-snap rail of compact cards on mobile (148px)
 * and tablet (212px), a 5-column grid on desktop. The handoff keeps this a
 * rail rather than a grid at tablet on purpose: swiping beats a cramped
 * multi-column grid on touch. These cards are deliberately lighter than
 * ProductCard: no badge, no wishlist heart, no CTA.
 */
export function RelatedProducts({
  locale,
  products,
  categorySlug,
}: {
  locale: Locale;
  products: Product[];
  categorySlug: string;
}) {
  if (products.length === 0) return null;
  const dict = getDictionary(locale);
  const category = getCategoryBySlug("mne", categorySlug);

  return (
    <section className="pt-6">
      <div className="flex items-baseline justify-between gap-3 px-4 md:px-6 xl:px-0">
        <h2 className="text-h2 font-bold md:text-[1.625rem] md:tracking-[-0.03em] xl:text-h2-lg">
          {dict.product.relatedHeading}
        </h2>
        {category && (
          <Link
            href={categoryPath(locale, category.slug[locale])}
            className="flex min-h-11 items-center whitespace-nowrap text-[0.9375rem] font-medium text-teal-ink transition hover:text-teal-hover md:text-base md:font-semibold xl:min-h-0 xl:font-medium"
          >
            {dict.product.viewAll}
            <span className="hidden md:inline">&nbsp;→</span>
          </Link>
        )}
      </div>

      <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-[22px] pt-1 md:mt-[18px] md:gap-3.5 md:px-6 md:pb-1 xl:mt-6 xl:grid xl:grid-cols-5 xl:gap-5 xl:overflow-visible xl:px-0 xl:pb-0">
        {products.map((product) => {
          const brand = getBrandBySlug(product.brandSlug);
          const productCategory = getCategoryBySlug("mne", product.categorySlug);
          const href = productPath(
            locale,
            productCategory?.slug[locale] ?? product.categorySlug,
            product.slug,
          );
          const alt = `${brand?.name ?? ""} ${product.name}`.trim();
          const imageSrc = product.image
            ? urlForImage(product.image).width(400).height(400).fit("crop").auto("format").url()
            : product.localImage;

          return (
            <Link
              key={`${product.categorySlug}/${product.slug}`}
              href={href}
              className="flex w-[148px] shrink-0 snap-start flex-col overflow-hidden rounded-card bg-surface text-ink shadow-card md:w-[212px] md:rounded-[20px] md:bg-fill md:shadow-none xl:w-auto"
            >
              {imageSrc ? (
                <div className="relative aspect-square w-full bg-[#f7f7f9] md:bg-transparent">
                  <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 768px) 212px, 148px"
                    className="object-contain p-3.5 md:p-5"
                  />
                </div>
              ) : (
                <ProductImagePlaceholder
                  alt={alt}
                  icon={productCategory?.icon}
                  className="aspect-square w-full"
                />
              )}
              <div className="flex flex-col gap-1 px-3 pb-3 pt-2.5 md:gap-[5px] md:px-3.5 md:pb-4 md:pt-1">
                {brand?.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-[11px] w-auto max-w-[52px] object-contain object-left opacity-75 md:h-3 md:max-w-[56px] md:opacity-70"
                  />
                ) : (
                  brand && (
                    <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-muted">
                      {brand.name}
                    </span>
                  )
                )}
                <p className="text-[0.90625rem] font-semibold leading-[1.25] tracking-[-0.015em] md:text-[0.96875rem]">
                  {product.name}
                </p>
                <p className="text-[0.78125rem] text-muted md:text-[0.84375rem]">
                  {dict.featured.priceOnRequest}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
