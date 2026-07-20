import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { getBrandBySlug } from "@/lib/brands";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { contactPath, productPath } from "@/lib/paths";
import { getDictionary } from "@/lib/dictionary";
import { urlForImage } from "@/sanity/lib/image";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { BrandMark } from "../ui/BrandMark";
import { ProductImagePlaceholder } from "../ui/ProductImagePlaceholder";

export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const brand = getBrandBySlug(product.brandSlug);
  const category = getCategoryBySlug("mne", product.categorySlug);
  const dict = getDictionary(locale);
  const href = productPath(locale, category?.slug[locale] ?? product.categorySlug, product.slug);
  const quoteHref = `${contactPath(locale)}?product=${encodeURIComponent(product.name)}`;
  const alt = `${brand?.name ?? ""} ${product.name}`.trim();
  const specs = product.specs?.slice(0, 3) ?? [];

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      <Link
        href={href}
        className="flex flex-1 flex-col"
        aria-label={product.name}
        data-testid="product-result"
      >
        {product.image || product.localImage ? (
          <div className="relative aspect-[4/3] w-full border-b border-line bg-warehouse">
            <Image
              src={
                product.image
                  ? urlForImage(product.image).width(480).height(360).fit("crop").auto("format").url()
                  : product.localImage!
              }
              alt={alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-contain p-3"
            />
          </div>
        ) : (
          <ProductImagePlaceholder
            alt={alt}
            icon={category?.icon}
            className="aspect-[4/3] w-full border-b border-line"
          />
        )}
        <div className="flex flex-1 flex-col gap-1.5 p-4 pb-0">
          {brand && <BrandMark name={brand.name} logo={brand.logo} className="self-start px-2 py-1 text-xs" />}
          <h3 className="font-heading text-lg font-semibold leading-tight text-navy">
            {product.name}
          </h3>
          {specs.length > 0 ? (
            <ul className="mt-0.5 space-y-0.5 text-xs leading-normal text-muted">
              {specs.map((spec) => (
                <li key={spec.label[locale]}>
                  {spec.label[locale]}: {spec.value}
                </li>
              ))}
            </ul>
          ) : (
            <p className="line-clamp-2 text-sm text-muted">{product.description[locale]}</p>
          )}
        </div>
      </Link>
      <div className="p-4 pt-3">
        <Button href={quoteHref} variant="primary" size="lg" className="w-full">
          {dict.featured.requestQuote}
        </Button>
      </div>
    </Card>
  );
}
