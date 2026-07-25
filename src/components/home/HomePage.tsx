import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { alternateHomePath } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { LocationsSection } from "../shared/LocationsSection";
import { Hero } from "./Hero";
import { TrustBar } from "./TrustBar";
import { ProductsOnSale } from "./ProductsOnSale";
import { NewArrivals } from "./NewArrivals";
import { AktuelnoSection } from "./AktuelnoSection";
import { BrandsGrid } from "./BrandsGrid";
import { WholesaleCtaBand } from "./WholesaleCtaBand";

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} alternateHref={alternateHomePath(locale)} />
      <main>
        <Hero locale={locale} />
        <TrustBar locale={locale} />
        <ProductsOnSale locale={locale} />
        <NewArrivals locale={locale} />
        <AktuelnoSection locale={locale} />
        <BrandsGrid locale={locale} />
        <WholesaleCtaBand locale={locale} />
        <LocationsSection
          locale={locale}
          heading={dict.locations.heading}
          subheading={dict.locations.subheading}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
