import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product/ProductDetailPage";
import { categories, getCategoryBySlug } from "@/lib/taxonomy";
import { getProductBySlug, getProductsByCategory } from "@/lib/data";

export async function generateStaticParams() {
  const perCategory = await Promise.all(
    categories.map(async (category) => {
      const products = await getProductsByCategory(category.slug.mne);
      return products.map((product) => ({ category: category.slug.mne, product: product.slug }));
    }),
  );
  return perCategory.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, product: productSlug } = await params;
  const category = getCategoryBySlug("mne", categorySlug);
  if (!category) return {};
  const product = await getProductBySlug(category.slug.mne, productSlug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description.mne,
    alternates: {
      canonical: `/proizvodi/${category.slug.mne}/${product.slug}`,
      languages: {
        "sr-ME": `/proizvodi/${category.slug.mne}/${product.slug}`,
        en: `/en/products/${category.slug.en}/${product.slug}`,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category: categorySlug, product: productSlug } = await params;
  const category = getCategoryBySlug("mne", categorySlug);
  if (!category) notFound();
  const product = await getProductBySlug(category.slug.mne, productSlug);
  if (!product) notFound();

  return <ProductDetailPage locale="mne" product={product} />;
}
