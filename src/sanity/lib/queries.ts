/**
 * GROQ queries for the live-data path, consumed by src/lib/data.ts behind
 * the `sanityConfigured` flag. Projections are flattened (refs resolved to
 * plain slug strings, localized fields grouped) so results match the local
 * Product/Category/Brand shapes in src/lib/ with no further mapping needed.
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

/** Just the _id — used to resolve a category slug into the reference id product.category points at. */
export const categoryIdBySlugQuery = /* groq */ `
  *[_type == "category" && slug_mne.current == $slug][0] { _id }
`;

const productProjection = /* groq */ `
  "slug": slug.current,
  "name": title_mne,
  "brandSlug": brand->slug.current,
  "categorySlug": category->slug_mne.current,
  subcategorySlug,
  "description": { "mne": description_mne, "en": description_en },
  image,
  featured
`;

export const productsByCategoryQuery = /* groq */ `
  *[_type == "product" && category._ref == $categoryId] | order(title_mne asc) {
    ${productProjection}
  }
`;

export const featuredProductsQuery = /* groq */ `
  *[_type == "product" && featured == true] {
    ${productProjection}
  }
`;

export const productBySlugQuery = /* groq */ `
  *[_type == "product" && slug.current == $slug][0] {
    ${productProjection},
    "specs": specs[]{ "label": { "mne": label_mne, "en": label_en }, value },
    "specPdfUrl": specPdf.asset->url,
    manufacturerUrl
  }
`;

export const brandsQuery = /* groq */ `
  *[_type == "brand"] | order(name asc) {
    name, "slug": slug.current, logo, description_mne, description_en, website
  }
`;
