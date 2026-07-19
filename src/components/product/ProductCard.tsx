import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { getBrandBySlug } from "@/lib/brands";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { productPath } from "@/lib/paths";
import { getDictionary } from "@/lib/dictionary";
import { Card } from "../ui/Card";
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

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      <Link href={href} className="flex h-full flex-col" aria-label={product.name}>
        <ProductImagePlaceholder
          alt={`${brand?.name ?? ""} ${product.name}`.trim()}
          icon={category?.icon}
          className="aspect-[4/3] w-full border-b border-line"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          {brand && <BrandMark name={brand.name} className="self-start px-2 py-1 text-xs" />}
          <h3 className="font-heading text-lg font-semibold leading-tight text-navy">
            {product.name}
          </h3>
          <p className="line-clamp-2 flex-1 text-sm text-muted">
            {product.description[locale]}
          </p>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-navy transition group-hover:text-orange">
            {dict.featured.viewDetails}
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
