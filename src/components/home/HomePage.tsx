import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { alternateHomePath } from "@/lib/paths";
import { getFeaturedProducts, getNewProducts, getOnSaleProducts } from "@/lib/data";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { Container } from "../ui/Container";
import { StoresSection } from "../shared/StoresSection";
import { WholesaleCtaCard } from "../shared/WholesaleCtaCard";
import { HomeHero } from "./HomeHero";
import { FeaturedProductCard } from "./FeaturedProductCard";
import { ProductFeed } from "./ProductFeed";
import { DepartmentsSection } from "./DepartmentsSection";
import { ServiceCard } from "./ServiceCard";
import { BrandsSection } from "./BrandsSection";

/**
 * Home screen. Mobile is a single 16px-padded column of stacked sections;
 * desktop is a 1280px container with a 2-column hero and multi-column
 * section grids. Both come from the same tree — the sections switch layout
 * at `lg`, they are not separate pages.
 */
export async function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [featured, onSale, isNew] = await Promise.all([
    getFeaturedProducts(),
    getOnSaleProducts(),
    getNewProducts(),
  ]);

  return (
    <>
      <Header locale={locale} alternateHref={alternateHomePath(locale)} />

      <main className="flex-1">
        {/* Hero + featured card: stacked on mobile, side by side on desktop. */}
        <Container className="pt-2 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:pt-14">
          <HomeHero locale={locale} />
          <div className="py-4 lg:py-0">
            <FeaturedProductCard products={featured} locale={locale} />
          </div>
        </Container>

        <Container className="lg:mt-16">
          <DepartmentsSection locale={locale} />
        </Container>

        {/* Full-bleed on mobile so the rail can scroll past the gutter. */}
        <div className="mt-0 lg:mt-16">
          <Container className="px-0 lg:px-8">
            <ProductFeed onSale={onSale} isNew={isNew} locale={locale} />
          </Container>
        </div>

        <Container className="lg:mt-16">
          <ServiceCard locale={locale} />
        </Container>

        <Container className="lg:mt-16">
          <BrandsSection locale={locale} />
        </Container>

        {/* Wholesale + map sit side by side on desktop, stacked on mobile. */}
        <Container className="pb-6 lg:mt-16 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 lg:pb-16">
          <section className="pb-[22px] lg:order-2 lg:pb-0">
            <h2 className="mb-3 text-h2 font-bold lg:mb-8 lg:text-h2-lg">
              {dict.home.storesHeading}
            </h2>
            <StoresSection locale={locale} />
          </section>

          <div className="pb-6 lg:order-1 lg:pb-0 lg:pt-[52px]">
            <WholesaleCtaCard locale={locale} />
          </div>
        </Container>
      </main>

      <Footer locale={locale} />
    </>
  );
}
