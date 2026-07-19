/**
 * GROQ queries for the future live-data path. Not yet called from any page —
 * src/lib/data.ts currently serves seed data from src/lib/products.ts,
 * taxonomy.ts and brands.ts. Once a Sanity project is connected
 * (see .env.local.example), wire these into src/lib/data.ts behind the
 * `sanityConfigured` flag so components don't need to change.
 */

export const categoriesQuery = /* groq */ `
  *[_type == "category"] | order(orderRank asc) {
    _id, name_mne, name_en, slug_mne, slug_en, intro_mne, intro_en, subcategories
  }
`;

export const categoryBySlugQuery = /* groq */ `
  *[_type == "category" && (slug_mne.current == $slug || slug_en.current == $slug)][0] {
    _id, name_mne, name_en, slug_mne, slug_en, intro_mne, intro_en, subcategories
  }
`;

export const productsByCategoryQuery = /* groq */ `
  *[_type == "product" && category._ref == $categoryId] {
    _id, title_mne, title_en, slug, image, description_mne, description_en,
    subcategorySlug, featured,
    "brand": brand->{name, slug, logo}
  }
`;

export const featuredProductsQuery = /* groq */ `
  *[_type == "product" && featured == true] {
    _id, title_mne, title_en, slug, image, description_mne, description_en,
    "brand": brand->{name, slug, logo},
    "category": category->{slug_mne, slug_en}
  }
`;

export const brandsQuery = /* groq */ `
  *[_type == "brand"] | order(name asc) { _id, name, slug, logo }
`;
