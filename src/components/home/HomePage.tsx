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
 * tablet is a 1194px/24px container whose grids are intrinsic (so they resolve
 * for both iPad orientations without an orientation branch); desktop is a
 * 1280px container with a 2-column hero and multi-column section grids. All
 * three come from the same tree — the sections switch layout at `md` and `xl`,
 * they are not separate pages.
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
        {/*
          Hero + featured card. Tablet uses an intrinsic 340px track rather
          than a fixed 2-column grid: it lands side-by-side in landscape and
          stacks in portrait by itself, which is exactly the handoff's intent
          and costs no orientation query.
        */}
        <Container className="pt-2 md:grid md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))] md:items-stretch md:gap-5 md:pt-6 xl:grid-cols-2 xl:items-center xl:gap-12 xl:pt-14">
          <HomeHero locale={locale} />
          <div className="py-4 md:py-0">
            <FeaturedProductCard products={featured} locale={locale} />
          </div>
        </Container>

        <Container className="md:mt-10 xl:mt-16">
          <DepartmentsSection locale={locale} />
        </Container>

        {/* Full-bleed on mobile and tablet so the rail can scroll past the
            gutter; the desktop grid needs the padding back. */}
        <div className="mt-0 md:mt-10 xl:mt-16">
          <Container className="px-0 md:px-0 xl:px-8">
            <ProductFeed onSale={onSale} isNew={isNew} locale={locale} />
          </Container>
        </div>

        <Container className="md:mt-10 xl:mt-16">
          <ServiceCard locale={locale} />
        </Container>

        <Container className="md:mt-10 xl:mt-16">
          <BrandsSection locale={locale} />
        </Container>

        {/* Wholesale + map: intrinsic 330px track at tablet (2-up landscape,
            stacked portrait), fixed 2-column at desktop. */}
        <Container className="pb-6 md:mt-10 md:grid md:grid-cols-[repeat(auto-fit,minmax(330px,1fr))] md:items-start md:gap-4 md:pb-10 xl:mt-16 xl:grid-cols-2 xl:gap-10 xl:pb-16">
          <section className="pb-[22px] md:order-2 md:pb-0">
            <h2 className="mb-3 text-h2 font-bold md:sr-only xl:not-sr-only xl:mb-8 xl:text-h2-lg">
              {dict.home.storesHeading}
            </h2>
            <StoresSection locale={locale} />
          </section>

          <div className="pb-6 md:order-1 md:pb-0 xl:pt-[52px]">
            <WholesaleCtaCard locale={locale} />
          </div>
        </Container>
      </main>

      <Footer locale={locale} />
    </>
  );
}
