"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageX, Phone, SlidersHorizontal, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getCategoryBySlug, type Category } from "@/lib/taxonomy";
import type { Product } from "@/lib/products";
import { brands as allBrands, getBrandBySlug } from "@/lib/brands";
import { contactPath } from "@/lib/paths";
import { ProductCard } from "../product/ProductCard";
import { Button } from "../ui/Button";

export function CategoryBrowser({
  locale,
  categorySlug,
  products,
}: {
  locale: Locale;
  categorySlug: string;
  products: Product[];
}) {
  const dict = getDictionary(locale);
  const category = getCategoryBySlug("mne", categorySlug)!;
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brandParam ? [brandParam] : [],
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brandsInCategory = useMemo(() => {
    const slugsInCategory = new Set(products.map((p) => p.brandSlug));
    return allBrands.filter((b) => slugsInCategory.has(b.slug));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const subcategoryMatch =
        selectedSubcategories.length === 0 ||
        selectedSubcategories.includes(product.subcategorySlug);
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brandSlug);
      return subcategoryMatch && brandMatch;
    });
  }, [products, selectedSubcategories, selectedBrands]);

  function toggleSubcategory(slug: string) {
    setSelectedSubcategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function toggleBrand(slug: string) {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function clearFilters() {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
  }

  const activeCount = selectedSubcategories.length + selectedBrands.length;

  const chips = [
    ...selectedSubcategories.map((slug) => {
      const sub = category.subcategories.find((s) => s.slug.mne === slug);
      return { key: `sub-${slug}`, label: sub?.name[locale] ?? slug, onRemove: () => toggleSubcategory(slug) };
    }),
    ...selectedBrands.map((slug) => {
      const brand = brandsInCategory.find((b) => b.slug === slug) ?? getBrandBySlug(slug);
      return { key: `brand-${slug}`, label: brand?.name ?? slug, onRemove: () => toggleBrand(slug) };
    }),
  ];

  const singleActiveBrandName =
    selectedBrands.length === 1
      ? (brandsInCategory.find((b) => b.slug === selectedBrands[0]) ?? getBrandBySlug(selectedBrands[0]))?.name
      : undefined;

  const emptyMessage = singleActiveBrandName
    ? dict.category.emptyBrandTemplate.replace("{brand}", singleActiveBrandName)
    : dict.category.emptyGeneric;

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="hidden lg:block">
        <FilterPanel
          locale={locale}
          category={category}
          brandsInCategory={brandsInCategory}
          selectedSubcategories={selectedSubcategories}
          selectedBrands={selectedBrands}
          onToggleSubcategory={toggleSubcategory}
          onToggleBrand={toggleBrand}
        />
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {filteredProducts.length} {dict.category.resultsLabel}
          </p>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-button border border-line bg-surface px-4 py-2 text-sm font-semibold text-navy lg:hidden"
          >
            <SlidersHorizontal className="size-4" strokeWidth={2} aria-hidden="true" />
            {dict.category.filtersHeading}
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-orange text-xs text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-navy transition hover:border-orange"
              >
                {chip.label}
                <X className="size-3.5" strokeWidth={2} aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="px-2 py-1.5 text-sm font-semibold text-muted underline-offset-2 transition hover:text-orange hover:underline"
            >
              {dict.category.clearFilters}
            </button>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-button border border-line bg-surface px-6 py-16 text-center">
            <PackageX className="size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="max-w-md text-ink">{emptyMessage}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button href={contactPath(locale)} variant="primary" size="md">
                {dict.category.emptyContactCta}
              </Button>
              <Button
                href="tel:+38220260528"
                variant="secondary"
                size="md"
              >
                <Phone className="size-4" strokeWidth={2} aria-hidden="true" />
                {dict.category.emptyCallCta}
              </Button>
            </div>
          </div>
        )}
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/50"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-button bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-h3 font-semibold text-navy">
                {dict.category.filtersHeading}
              </h2>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close">
                <X className="size-6 text-navy" strokeWidth={2} />
              </button>
            </div>
            <FilterPanel
              locale={locale}
              category={category}
              brandsInCategory={brandsInCategory}
              selectedSubcategories={selectedSubcategories}
              selectedBrands={selectedBrands}
              onToggleSubcategory={toggleSubcategory}
              onToggleBrand={toggleBrand}
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="sticky bottom-0 mt-6 w-full rounded-button bg-orange py-3 text-label font-semibold uppercase tracking-wide text-white"
            >
              {dict.category.applyFilters} ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  locale,
  category,
  brandsInCategory,
  selectedSubcategories,
  selectedBrands,
  onToggleSubcategory,
  onToggleBrand,
}: {
  locale: Locale;
  category: Category;
  brandsInCategory: { name: string; slug: string }[];
  selectedSubcategories: string[];
  selectedBrands: string[];
  onToggleSubcategory: (slug: string) => void;
  onToggleBrand: (slug: string) => void;
}) {
  const dict = getDictionary(locale);

  return (
    <div className="space-y-6">
      <details open className="group border-b border-line pb-6">
        <summary className="cursor-pointer list-none text-label font-semibold uppercase tracking-wide text-navy">
          {dict.category.subcategoryLabel}
        </summary>
        <ul className="mt-4 space-y-3">
          {category.subcategories.map((sub) => (
            <li key={sub.slug.mne}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  className="size-4 accent-orange"
                  checked={selectedSubcategories.includes(sub.slug.mne)}
                  onChange={() => onToggleSubcategory(sub.slug.mne)}
                />
                {sub.name[locale]}
              </label>
            </li>
          ))}
        </ul>
      </details>

      <details open className="group pb-6">
        <summary className="cursor-pointer list-none text-label font-semibold uppercase tracking-wide text-navy">
          {dict.category.brandLabel}
        </summary>
        <ul className="mt-4 space-y-3">
          {brandsInCategory.map((brand) => (
            <li key={brand.slug}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  className="size-4 accent-orange"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => onToggleBrand(brand.slug)}
                />
                {brand.name}
              </label>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
