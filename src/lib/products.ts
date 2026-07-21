import type { SanityImageSource } from "@sanity/image-url";
import type { Localized } from "./i18n";
import { categories } from "./taxonomy";

export interface ProductSpec {
  label: Localized;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  brandSlug: string;
  /** Canonical MNE category/subcategory slugs — stand in for a CMS reference id. */
  categorySlug: string;
  subcategorySlug: string;
  description: Localized;
  /** Optional — spec tables only render when this has entries (brief: never show "N/A"). */
  specs?: ProductSpec[];
  specPdfUrl?: string;
  manufacturerUrl?: string;
  featured?: boolean;
  /** Shown with an "on sale" badge in the homepage Products on Sale section — no price data exists in this catalog, so this is a flag only, not a discount amount. */
  onSale?: boolean;
  /**
   * Raw Sanity image reference — only present when fetched from a live
   * Sanity dataset with a photo uploaded. Resolve with urlForImage().
   * Always undefined for this seed data; components fall back to
   * ProductImagePlaceholder when it's absent.
   */
  image?: SanityImageSource;
  /** Static /public path used as a stand-in until real Sanity photos exist. */
  localImage?: string;
}

/**
 * Seed data standing in for CMS content — no real product catalog was
 * recoverable from the legacy site (see brief's "Known open item"). Shaped
 * to match the future Sanity product schema so swapping in real queries
 * later only touches lib/data.ts, not the components consuming it.
 */
export const products: Product[] = [
  {
    slug: "bosch-gsb-18v-55",
    name: "Bosch GSB 18V-55",
    brandSlug: "bosch",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "akumulatorski-alati",
    description: {
      mne: "Akumulatorska udarna bušilica-zavrtač za profesionalnu upotrebu, sa beskolektorskim motorom i visokim obrtnim momentom.",
      en: "Professional cordless combi drill with brushless motor and high torque output for demanding job-site use.",
    },
    specs: [
      { label: { mne: "Napon", en: "Voltage" }, value: "18 V" },
      { label: { mne: "Obrtni moment", en: "Max torque" }, value: "63 Nm" },
      { label: { mne: "Težina", en: "Weight" }, value: "1.6 kg" },
    ],
    featured: true,
    onSale: true,
    localImage: "/products/bosch-gsb-18v-55.jpg",
  },
  {
    slug: "makita-hr2470",
    name: "Makita HR2470",
    brandSlug: "makita",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "elektricni-alati",
    description: {
      mne: "Elektro-pneumatska rotaciona čekić-bušilica od 780 W, za bušenje betona i lakše rušenje.",
      en: "780 W rotary hammer drill for concrete drilling and light chiseling work.",
    },
    specs: [
      { label: { mne: "Snaga", en: "Power" }, value: "780 W" },
      { label: { mne: "Energija udarca", en: "Impact energy" }, value: "2.4 J" },
    ],
    featured: true,
    localImage: "/products/makita-hr2470.png",
  },
  {
    slug: "einhell-te-cd-18-li",
    name: "Einhell TE-CD 18 Li",
    brandSlug: "einhell",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "akumulatorski-alati",
    description: {
      mne: "Kompaktna akumulatorska bušilica-zavrtač iz Power X-Change sistema, pogodna za kućnu i profesionalnu upotrebu.",
      en: "Compact cordless drill driver from the Power X-Change platform, suited to both home and professional use.",
    },
    localImage: "/products/einhell-te-cd-18-li.png",
  },
  {
    slug: "telwin-tecnica-211-s",
    name: "Telwin Tecnica 211/S",
    brandSlug: "telwin",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "zavarivanje-i-lemljenje",
    description: {
      mne: "Inverterski aparat za MIG-MAG i MMA zavarivanje, jednostavan za podešavanje i pouzdan na gradilištu.",
      en: "Inverter welding machine for MIG-MAG and MMA welding, straightforward to set up and reliable on site.",
    },
    specs: [
      { label: { mne: "Struja zavarivanja", en: "Welding current" }, value: "40–200 A" },
      { label: { mne: "Napajanje", en: "Power supply" }, value: "230 V" },
    ],
    featured: true,
    onSale: true,
    localImage: "/products/telwin-tecnica-211-s.png",
  },
  {
    slug: "knipex-cobra-xl",
    name: "Knipex Cobra XL",
    brandSlug: "knipex",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "rucni-alati",
    description: {
      mne: "Vodopumpne klješta velikog raspona hvatanja, kovane iz jednog komada čelika.",
      en: "Water pump pliers with an extra-wide gripping range, forged from a single piece of steel.",
    },
    localImage: "/products/knipex-cobra-xl.png",
  },
  {
    slug: "bosch-gws-750",
    name: "Bosch GWS 750",
    brandSlug: "bosch",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "elektricni-alati",
    description: {
      mne: "Ugaona brusilica od 750 W sa diskom od 125 mm, kompaktna i otporna na opterećenje.",
      en: "750 W angle grinder with a 125 mm disc, compact and built to handle sustained loads.",
    },
    specs: [
      { label: { mne: "Snaga", en: "Power" }, value: "750 W" },
      { label: { mne: "Disk", en: "Disc diameter" }, value: "125 mm" },
    ],
    featured: true,
    localImage: "/products/bosch-gws-750.jpg",
  },
  {
    slug: "makita-ek7651h",
    name: "Makita EK7651H",
    brandSlug: "makita",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "benzinski-alati",
    description: {
      mne: "Benzinska rezačica za beton i metal, sa snažnim dvotaktnim motorom za intenzivnu upotrebu.",
      en: "Petrol-powered disc cutter for concrete and metal, with a powerful two-stroke engine for heavy use.",
    },
    onSale: true,
    localImage: "/products/makita-ek7651h.png",
  },
  {
    slug: "bosch-glm-50-c",
    name: "Bosch GLM 50 C",
    brandSlug: "bosch",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "mjerni-i-kontrolni-alati",
    description: {
      mne: "Laserski daljinomjer sa Bluetooth povezivanjem i dometom do 50 metara.",
      en: "Laser measure with Bluetooth connectivity and a range of up to 50 metres.",
    },
    specs: [
      { label: { mne: "Domet", en: "Range" }, value: "0.05–50 m" },
      { label: { mne: "Preciznost", en: "Accuracy" }, value: "± 1.5 mm" },
    ],
    localImage: "/products/bosch-glm-50-c.png",
  },
  {
    slug: "knipex-86-03-250",
    name: "Knipex 86 03 250",
    brandSlug: "knipex",
    categorySlug: "alati-i-oprema",
    subcategorySlug: "alati-za-stezanje-i-savijanje",
    description: {
      mne: "Klješta-ključ sa podesivim rasponom, za brzo i precizno stezanje bez podešavanja navojem.",
      en: "Pliers wrench with a self-adjusting jaw for fast, precise clamping without a threaded adjustment.",
    },
    localImage: "/products/knipex-86-03-250.png",
  },
  {
    slug: "claber-aquauno-video-6",
    name: "Claber Aquauno Video 6",
    brandSlug: "claber",
    categorySlug: "basta-i-eksterijer",
    subcategorySlug: "navodnjavanje-pumpe-i-hidrofori",
    description: {
      mne: "Programator za navodnjavanje sa displejem, do 6 nezavisnih ciklusa zalivanja dnevno.",
      en: "Irrigation timer with a display, supporting up to 6 independent watering cycles per day.",
    },
    onSale: true,
  },
];

export function getProductsByCategory(categorySlugMne: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlugMne);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getOnSaleProducts(): Product[] {
  return products.filter((p) => p.onSale);
}

export function getProductBySlug(categorySlugMne: string, productSlug: string): Product | undefined {
  return products.find((p) => p.categorySlug === categorySlugMne && p.slug === productSlug);
}

/** Same subcategory first, then filled out from the rest of the category — excludes itself. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug);
  const sameSubcategory = sameCategory.filter((p) => p.subcategorySlug === product.subcategorySlug);
  const rest = sameCategory.filter((p) => p.subcategorySlug !== product.subcategorySlug);
  return [...sameSubcategory, ...rest].slice(0, limit);
}

/** MNE category/subcategory slug -> both locale names, so a query can match "Bušilice" without the caller resolving the taxonomy itself. */
const categoryNamesBySlug = new Map<string, string[]>();
for (const category of categories) {
  categoryNamesBySlug.set(category.slug.mne, [category.name.mne, category.name.en]);
  for (const sub of category.subcategories) {
    categoryNamesBySlug.set(sub.slug.mne, [sub.name.mne, sub.name.en]);
  }
}

/** Strips diacritics (š -> s, č -> c, ...) and lowercases, so users don't need to type accents to match them. */
function normalizeForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Name, category/subcategory names (both locales) and description — everything a query can match against. */
function searchableText(p: Product): string {
  const categoryNames = categoryNamesBySlug.get(p.categorySlug) ?? [];
  const subcategoryNames = categoryNamesBySlug.get(p.subcategorySlug) ?? [];
  return normalizeForSearch(
    [p.name, ...categoryNames, ...subcategoryNames, p.description.mne, p.description.en].join(" "),
  );
}

/** Exact name match ranks first, then a name starting with the term, then any other substring match (category/description hits included). */
function relevanceRank(name: string, query: string): number {
  const normalized = normalizeForSearch(name);
  if (normalized === query) return 0;
  if (normalized.startsWith(query)) return 1;
  return 2;
}

/** Shared by the seed path and the Sanity path in lib/data.ts so both rank results the same way. */
export function rankProductsByQuery(list: Product[], query: string): Product[] {
  const q = normalizeForSearch(query);
  if (!q) return [];
  return list
    .filter((p) => searchableText(p).includes(q))
    .sort((a, b) => relevanceRank(a.name, q) - relevanceRank(b.name, q));
}

export function searchProducts(query: string): Product[] {
  return rankProductsByQuery(products, query);
}

/** The category (MNE slug) with the most products from this brand, if any. */
export function getPrimaryCategoryForBrand(brandSlug: string): string | undefined {
  const counts = new Map<string, number>();
  for (const product of products) {
    if (product.brandSlug !== brandSlug) continue;
    counts.set(product.categorySlug, (counts.get(product.categorySlug) ?? 0) + 1);
  }
  let best: string | undefined;
  let bestCount = 0;
  for (const [categorySlug, count] of counts) {
    if (count > bestCount) {
      best = categorySlug;
      bestCount = count;
    }
  }
  return best;
}
