/**
 * Live-data bridge for products: reads from Sanity when a project is
 * configured (see src/sanity/env.ts), otherwise falls back to the seed
 * data in products.ts — same fallback also applies if a Sanity fetch
 * throws, so a misconfigured or unreachable dataset degrades to seed data
 * rather than breaking the page. Categories and brands stay on the seed
 * path for now (see products.ts / brands.ts) until the CMS brand roster
 * is confirmed.
 */
import { client } from "@/sanity/lib/client";
import { sanityConfigured } from "@/sanity/env";
import {
  categoryIdBySlugQuery,
  productsByCategoryQuery,
  featuredProductsQuery,
  productBySlugQuery,
  allProductsQuery,
} from "@/sanity/lib/queries";
import {
  getProductsByCategory as seedGetProductsByCategory,
  getFeaturedProducts as seedGetFeaturedProducts,
  getProductBySlug as seedGetProductBySlug,
  getRelatedProducts as seedGetRelatedProducts,
  searchProducts as seedSearchProducts,
  rankProductsByQuery,
  type Product,
} from "./products";

export type { Product };

export async function getProductsByCategory(categorySlugMne: string): Promise<Product[]> {
  if (!sanityConfigured || !client) return seedGetProductsByCategory(categorySlugMne);
  try {
    const categoryRef = await client.fetch<{ _id: string } | null>(categoryIdBySlugQuery, {
      slug: categorySlugMne,
    });
    if (!categoryRef) return [];
    const docs = await client.fetch<Product[]>(productsByCategoryQuery, {
      categoryId: categoryRef._id,
    });
    return docs ?? [];
  } catch (err) {
    console.error("[data] Sanity fetch failed for getProductsByCategory, falling back to seed data", err);
    return seedGetProductsByCategory(categorySlugMne);
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!sanityConfigured || !client) return seedGetFeaturedProducts();
  try {
    const docs = await client.fetch<Product[]>(featuredProductsQuery);
    return docs ?? [];
  } catch (err) {
    console.error("[data] Sanity fetch failed for getFeaturedProducts, falling back to seed data", err);
    return seedGetFeaturedProducts();
  }
}

export async function getProductBySlug(
  categorySlugMne: string,
  productSlug: string,
): Promise<Product | undefined> {
  if (!sanityConfigured || !client) return seedGetProductBySlug(categorySlugMne, productSlug);
  try {
    const doc = await client.fetch<Product | null>(productBySlugQuery, { slug: productSlug });
    if (!doc || doc.categorySlug !== categorySlugMne) return undefined;
    return doc;
  } catch (err) {
    console.error("[data] Sanity fetch failed for getProductBySlug, falling back to seed data", err);
    return seedGetProductBySlug(categorySlugMne, productSlug);
  }
}

/**
 * Ranked by relevance (exact name match, then prefix match, then substring).
 * Safe to call from a client component too — the Sanity client here only
 * uses NEXT_PUBLIC_* env vars and the read-only CDN, so this runs the same
 * way in the browser as it does on the server.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  if (!sanityConfigured || !client) return seedSearchProducts(q);
  try {
    const docs = await client.fetch<Product[]>(allProductsQuery);
    return rankProductsByQuery(docs ?? [], q);
  } catch (err) {
    console.error("[data] Sanity fetch failed for searchProducts, falling back to seed data", err);
    return seedSearchProducts(q);
  }
}

/** Same subcategory first, then filled out from the rest of the category — excludes itself. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!sanityConfigured || !client) return seedGetRelatedProducts(product, limit);
  const categoryProducts = await getProductsByCategory(product.categorySlug);
  const sameCategory = categoryProducts.filter((p) => p.slug !== product.slug);
  const sameSubcategory = sameCategory.filter((p) => p.subcategorySlug === product.subcategorySlug);
  const rest = sameCategory.filter((p) => p.subcategorySlug !== product.subcategorySlug);
  return [...sameSubcategory, ...rest].slice(0, limit);
}
