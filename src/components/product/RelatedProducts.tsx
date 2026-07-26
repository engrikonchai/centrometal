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
 * "Slični proizvodi" — a scroll-snap rail of compact 148px cards on mobile,
 * a 5-column grid on desktop. These cards are deliberately lighter than
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
      <div className="flex items-baseline justify-between gap-3 px-4 lg:px-0">
        <h2 className="text-h2 font-bold lg:text-h2-lg">{dict.product.relatedHeading}</h2>
        {category && (
          <Link
            href={categoryPath(locale, category.slug[locale])}
            className="whitespace-nowrap text-[0.9375rem] font-medium text-teal-ink transition hover:text-teal-hover"
          >
            {dict.product.viewAll}
            <span className="hidden lg:inline"> →</span>
          </Link>
        )}
      </div>

      <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-[22px] pt-1 lg:mt-6 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
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
              className="flex w-[148px] shrink-0 snap-start flex-col overflow-hidden rounded-card bg-surface text-ink shadow-card lg:w-auto"
            >
              {imageSrc ? (
                <div className="relative aspect-square w-full bg-[#f7f7f9]">
                  <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 148px"
                    className="object-contain p-3.5"
                  />
                </div>
              ) : (
                <ProductImagePlaceholder
                  alt={alt}
                  icon={productCategory?.icon}
                  className="aspect-square w-full"
                />
              )}
              <div className="flex flex-col gap-1 px-3 pb-3 pt-2.5">
                {brand?.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-[11px] w-auto max-w-[52px] object-contain object-left opacity-75"
                  />
                ) : (
                  brand && (
                    <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-muted">
                      {brand.name}
                    </span>
                  )
                )}
                <p className="text-[0.90625rem] font-semibold leading-[1.25] tracking-[-0.015em]">
                  {product.name}
                </p>
                <p className="text-[0.78125rem] text-muted">{dict.featured.priceOnRequest}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
