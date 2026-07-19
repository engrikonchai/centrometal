import type { Localized } from "./i18n";
import { slugify } from "./slugify";

export interface Brand {
  name: string;
  slug: string;
  /** General product-category descriptor, not a Centrometal-specific claim. */
  descriptor: Localized;
}

/**
 * Named brands from the build brief only — do not invent additional
 * brand partnerships. Actual roster (30+) to be populated via CMS once
 * confirmed with the client; the homepage/brands-page grids note the rest.
 */
const brandData: { name: string; descriptor: Localized }[] = [
  {
    name: "Bosch",
    descriptor: {
      mne: "Električni i akumulatorski alati, mjerni instrumenti.",
      en: "Electric and cordless power tools, measuring tools.",
    },
  },
  {
    name: "Makita",
    descriptor: {
      mne: "Profesionalni akumulatorski i benzinski alati.",
      en: "Professional cordless and petrol-powered tools.",
    },
  },
  {
    name: "Einhell",
    descriptor: {
      mne: "DIY alati, baštenska i radionička oprema.",
      en: "DIY power tools, garden and workshop equipment.",
    },
  },
  {
    name: "Telwin",
    descriptor: {
      mne: "Aparati za zavarivanje i punjači akumulatora.",
      en: "Welding machines and battery chargers.",
    },
  },
  {
    name: "Kipor",
    descriptor: {
      mne: "Agregati i energetska oprema.",
      en: "Generators and power equipment.",
    },
  },
  {
    name: "Knipex",
    descriptor: {
      mne: "Precizna klješta i ručni alati.",
      en: "Precision pliers and hand tools.",
    },
  },
  {
    name: "Claber",
    descriptor: {
      mne: "Sistemi za navodnjavanje bašte.",
      en: "Garden irrigation systems.",
    },
  },
  {
    name: "Henkel",
    descriptor: {
      mne: "Ljepila, zaptivači i građevinska hemija.",
      en: "Adhesives, sealants and construction chemicals.",
    },
  },
  {
    name: "Viro",
    descriptor: {
      mne: "Brave i sigurnosni okov.",
      en: "Locks and security hardware.",
    },
  },
];

export const brands: Brand[] = brandData.map(({ name, descriptor }) => ({
  name,
  slug: slugify(name),
  descriptor,
}));

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}
