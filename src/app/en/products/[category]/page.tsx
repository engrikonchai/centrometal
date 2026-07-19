import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/category/CategoryPage";
import { categories, getCategoryBySlug } from "@/lib/taxonomy";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug.en }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug("en", categorySlug);
  if (!category) return {};

  return {
    title: category.name.en,
    description: category.intro.en,
    alternates: {
      canonical: `/en/products/${category.slug.en}`,
      languages: {
        "sr-ME": `/proizvodi/${category.slug.mne}`,
        en: `/en/products/${category.slug.en}`,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug("en", categorySlug);
  if (!category) notFound();

  return <CategoryPage locale="en" category={category} />;
}
