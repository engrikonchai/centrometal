/**
 * One-time (and safely re-runnable) migration of the local seed data in
 * src/lib/ into real Sanity documents, matching the shapes in
 * src/sanity/schemaTypes/. Every document uses a deterministic _id, so
 * re-running this after editing seed data upserts rather than duplicates.
 *
 * Product/brand images are intentionally NOT set here — no licensed
 * photography or logo assets exist yet. Both fields are optional in the
 * schema for exactly this reason; add real images later through Studio
 * (see AGENTS.md phase notes) without needing to re-run this script.
 *
 * Usage:
 *   npm run migrate:sanity              # writes to Sanity
 *   npm run migrate:sanity -- --dry-run # prints the documents, no network calls
 *
 * Requires (in .env.local): NEXT_PUBLIC_SANITY_PROJECT_ID,
 * NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN (a token with write access —
 * create one under manage.sanity.io -> API -> Tokens).
 */
import { createClient } from "next-sanity";
import { categories } from "../src/lib/taxonomy";
import { brands } from "../src/lib/brands";
import { products } from "../src/lib/products";
import { slugify } from "../src/lib/slugify";

const dryRun = process.argv.includes("--dry-run");

function slugField(current: string) {
  return { _type: "slug" as const, current };
}

function categoryDoc(category: (typeof categories)[number], orderRank: number) {
  return {
    _id: `category-${category.slug.mne}`,
    _type: "category" as const,
    name_mne: category.name.mne,
    name_en: category.name.en,
    slug_mne: slugField(category.slug.mne),
    slug_en: slugField(category.slug.en),
    intro_mne: category.intro.mne,
    intro_en: category.intro.en,
    orderRank,
    subcategories: category.subcategories.map((sub) => ({
      _type: "subcategory" as const,
      _key: sub.slug.mne,
      name_mne: sub.name.mne,
      name_en: sub.name.en,
      slug_mne: slugField(sub.slug.mne),
      slug_en: slugField(sub.slug.en),
    })),
  };
}

function brandDoc(brand: (typeof brands)[number]) {
  return {
    _id: `brand-${brand.slug}`,
    _type: "brand" as const,
    name: brand.name,
    slug: slugField(brand.slug),
    description_mne: brand.descriptor.mne,
    description_en: brand.descriptor.en,
  };
}

function productDoc(product: (typeof products)[number]) {
  return {
    _id: `product-${product.slug}`,
    _type: "product" as const,
    // Seed data only has one (untranslated) name — carried into both
    // locale fields so nothing regresses; retitle in Studio once real
    // localized product names are available.
    title_mne: product.name,
    title_en: product.name,
    slug: slugField(product.slug),
    brand: { _type: "reference" as const, _ref: `brand-${product.brandSlug}` },
    category: { _type: "reference" as const, _ref: `category-${product.categorySlug}` },
    subcategorySlug: product.subcategorySlug,
    description_mne: product.description.mne,
    description_en: product.description.en,
    featured: product.featured ?? false,
    specs: product.specs?.map((spec) => ({
      _type: "specRow" as const,
      _key: slugify(spec.label.en || spec.label.mne),
      label_mne: spec.label.mne,
      label_en: spec.label.en,
      value: spec.value,
    })),
    manufacturerUrl: product.manufacturerUrl,
  };
}

type MutationDoc = { _id: string; _type: string; [key: string]: unknown };

async function main() {
  const categoryDocs = categories.map(categoryDoc);
  const brandDocs = brands.map(brandDoc);
  const productDocs = products.map(productDoc);
  const allDocs: MutationDoc[] = [...categoryDocs, ...brandDocs, ...productDocs];

  if (dryRun) {
    console.log(JSON.stringify(allDocs, null, 2));
    console.log(
      `\n[dry run] ${categoryDocs.length} categories, ${brandDocs.length} brands, ${productDocs.length} products — nothing written.`,
    );
    return;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

  if (!projectId || !dataset || !token) {
    console.error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN in the environment.\n" +
        "Set these in .env.local (see .env.local.example) once the Sanity project is created, or run with --dry-run to preview without them.",
    );
    process.exit(1);
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

  console.log(`Migrating to Sanity project ${projectId}/${dataset}...`);
  let tx = client.transaction();
  for (const doc of allDocs) tx = tx.createOrReplace(doc);
  await tx.commit();

  console.log(
    `Done: upserted ${categoryDocs.length} categories, ${brandDocs.length} brands, ${productDocs.length} products.`,
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
