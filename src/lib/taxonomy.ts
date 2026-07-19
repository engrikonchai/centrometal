import {
  Wrench,
  Zap,
  TreePine,
  HardHat,
  Hammer,
  Droplet,
  Lock,
  PaintBucket,
  type LucideIcon,
} from "lucide-react";
import type { Locale, Localized } from "./i18n";
import { slugify } from "./slugify";

export interface Subcategory {
  name: Localized;
  slug: Localized;
}

export interface Category {
  name: Localized;
  slug: Localized;
  /** One-sentence SEO intro shown under the category H1. */
  intro: Localized;
  icon: LucideIcon;
  subcategories: Subcategory[];
}

function sub(nameMne: string, nameEn: string): Subcategory {
  return {
    name: { mne: nameMne, en: nameEn },
    slug: { mne: slugify(nameMne), en: slugify(nameEn) },
  };
}

export const categories: Category[] = [
  {
    name: { mne: "Alati i oprema", en: "Power Tools & Equipment" },
    slug: { mne: "alati-i-oprema", en: "power-tools-equipment" },
    intro: {
      mne: "Električni, akumulatorski, pneumatski i benzinski alati, oprema za zavarivanje i ručni alat vodećih svjetskih brendova.",
      en: "Electric, cordless, pneumatic and petrol-powered tools, welding equipment and hand tools from leading global brands.",
    },
    icon: Wrench,
    subcategories: [
      sub("Električni alati", "Electric tools"),
      sub("Akumulatorski alati", "Cordless & battery tools"),
      sub("Pneumatski alati", "Pneumatic tools"),
      sub("Benzinski alati", "Petrol-powered tools"),
      sub("Zavarivanje i lemljenje", "Welding & soldering"),
      sub("Ručni alati", "Hand tools"),
      sub("Mjerni i kontrolni alati", "Measuring & testing tools"),
      sub("Alati za stezanje i savijanje", "Clamping & bending tools"),
    ],
  },
  {
    name: { mne: "Mašine i agregati", en: "Power & Machinery" },
    slug: { mne: "masine-i-agregati", en: "power-machinery" },
    intro: {
      mne: "Agregati, motori, kompresori, viljuškari i oprema za manipulaciju i dizanje tereta.",
      en: "Generators, engines, compressors, forklifts and material handling & lifting equipment.",
    },
    icon: Zap,
    subcategories: [
      sub("Agregati", "Generators"),
      sub("Benzinski i dizel motori", "Petrol & diesel engines"),
      sub("Kompresori", "Compressors"),
      sub("Viljuškari", "Forklifts"),
      sub("Manipulacija i dizanje tereta", "Material handling & lifting"),
    ],
  },
  {
    name: { mne: "Bašta i eksterijer", en: "Garden & Outdoor" },
    slug: { mne: "basta-i-eksterijer", en: "garden-outdoor" },
    intro: {
      mne: "Baštenska oprema, kosilice, sistemi za navodnjavanje, bazeni i oprema za kampovanje.",
      en: "Garden equipment, mowers, irrigation systems, pools and camping gear.",
    },
    icon: TreePine,
    subcategories: [
      sub("Baštenska oprema", "Garden equipment"),
      sub("Kosilice, trimeri, testere i makaze", "Mowers, trimmers, saws & shears"),
      sub("Navodnjavanje, pumpe i hidrofori", "Irrigation, pumps & hydrophores"),
      sub("Prskalice, crijeva i fontane", "Sprayers, hoses & fountains"),
      sub("Bazeni i tuševi za dvorište", "Pools & outdoor showers"),
      sub("Vještačka trava", "Artificial grass"),
      sub("Kampovanje i roštilj", "Camping & BBQ"),
      sub("Zaštita od insekata", "Insect protection"),
    ],
  },
  {
    name: { mne: "Zaštita na radu (HTZ)", en: "Safety & Workwear (HTZ)" },
    slug: { mne: "zastita-na-radu-htz", en: "safety-workwear" },
    intro: {
      mne: "Radna odjeća, obuća, rukavice i zaštitna oprema za profesionalnu upotrebu.",
      en: "Workwear, footwear, gloves and protective equipment for professional use.",
    },
    icon: HardHat,
    subcategories: [
      sub("Radna odjeća", "Workwear"),
      sub("Radna obuća", "Footwear"),
      sub("Rukavice", "Gloves"),
      sub("Zaštitne naočare", "Eyewear"),
      sub("Zaštita disajnih organa i sluha", "Respiratory & hearing protection"),
      sub("Oprema za bezbjednost na putu", "Road safety equipment"),
    ],
  },
  {
    name: { mne: "Građevina, ograde i okov", en: "Building, Fencing & Hardware" },
    slug: { mne: "gradjevina-ograde-i-okov", en: "building-fencing-hardware" },
    intro: {
      mne: "Ograde i žičana mreža, brave, okov i alati za građevinu.",
      en: "Fencing and mesh, locks, fittings and construction tools.",
    },
    icon: Hammer,
    subcategories: [
      sub("Ograde i žičana mreža", "Fencing & mesh"),
      sub("Brave i okovi", "Locks & fittings"),
      sub("Šarke, nosači i držači", "Hinges, brackets & mounts"),
      sub("Okov za stolariju", "Wood joinery hardware"),
      sub("Građevinski alati", "Construction tools"),
      sub("Merdevine", "Ladders"),
    ],
  },
  {
    name: { mne: "Dom, kupatilo i vodovod", en: "Home, Bath & Plumbing" },
    slug: { mne: "dom-kupatilo-i-vodovod", en: "home-bath-plumbing" },
    intro: {
      mne: "Vodoinstalaterski materijal, kupatila, kućni aparati i proizvodi za higijenu.",
      en: "Plumbing supplies, bathroom fixtures, household appliances and hygiene products.",
    },
    icon: Droplet,
    subcategories: [
      sub("Vodoinstalaterski materijal", "Plumbing supplies"),
      sub("Kupatila i sudopere", "Bathrooms & sinks"),
      sub("Kućni aparati i potrepštine", "Household goods & small appliances"),
      sub("Proizvodi za pranje i higijenu", "Laundry & hygiene products"),
    ],
  },
  {
    name: { mne: "Skladištenje i sigurnost", en: "Storage & Security" },
    slug: { mne: "skladistenje-i-sigurnost", en: "storage-security" },
    intro: {
      mne: "Sefovi, ormari, sanduci i rješenja za skladištenje i organizaciju.",
      en: "Safes, cabinets, chests and storage & organization solutions.",
    },
    icon: Lock,
    subcategories: [
      sub("Sefovi", "Safes"),
      sub("Ormari", "Cabinets"),
      sub("Sanduci", "Chests"),
      sub("Skladištenje i organizacija", "Storage & organization"),
      sub("Kontejneri i saksije", "Containers & planters"),
    ],
  },
  {
    name: { mne: "Boje i završni radovi", en: "Paint & Finishing" },
    slug: { mne: "boje-i-zavrsni-radovi", en: "paint-finishing" },
    intro: {
      mne: "Boje, premazi, ljepila i pribor za farbanje i završne radove.",
      en: "Paints, coatings, adhesives and supplies for painting and finishing work.",
    },
    icon: PaintBucket,
    subcategories: [
      sub("Boje, premazi i ljepila", "Paints, coatings & adhesives"),
      sub("Pribor i alati za farbanje", "Painting supplies & tools"),
      sub("Ljepila i trake", "Adhesives & tapes"),
    ],
  },
];

export function getCategoryBySlug(
  locale: Locale,
  slug: string,
): Category | undefined {
  return categories.find((c) => c.slug[locale] === slug);
}
