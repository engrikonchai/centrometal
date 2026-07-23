import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categoryPath } from "@/lib/paths";
import { categories } from "@/lib/taxonomy";
import { getFeaturedProducts } from "@/lib/data";
import { getBrandBySlug } from "@/lib/brands";
import { urlForImage } from "@/sanity/lib/image";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

export async function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const firstCategoryHref = categoryPath(locale, categories[0].slug[locale]);

  const featured = await getFeaturedProducts();
  const slides: HeroSlide[] = featured
    .map((product): HeroSlide | null => {
      const src = product.image
        ? urlForImage(product.image).width(1200).height(900).fit("crop").auto("format").url()
        : product.localImage;
      if (!src) return null;
      const brand = getBrandBySlug(product.brandSlug);
      return { src, alt: `${brand?.name ?? ""} ${product.name}`.trim() };
    })
    .filter((slide): slide is HeroSlide => slide !== null);

  // Fall back to the original single hero image if no featured products resolve.
  const carouselSlides =
    slides.length > 0 ? slides : [{ src: "/products/bosch-gsb-18v-55.jpg", alt: "Bosch GSB 18V-55" }];

  const carouselLabel = locale === "en" ? "Featured products" : "Istaknuti proizvodi";

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="grain-overlay" aria-hidden="true" />
      <Container className="relative grid grid-cols-1 gap-6 pt-4 pb-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-24">
        <div>
          <p className="font-heading text-2xl font-bold uppercase tracking-[0.18em] text-white lg:text-3xl">
            Centro<span className="text-teal-on-dark">metal</span>
          </p>
          <h1 className="mt-4 font-heading text-[1.75rem] font-bold leading-[1.3] [text-shadow:0_2px_10px_rgba(0,0,0,0.35)] lg:mt-6 lg:text-[4.5rem] lg:leading-[1.02]">
            {dict.hero.headline}
          </h1>
          <div className="mt-6 lg:mt-8">
            <Button
              href={firstCategoryHref}
              variant="primary"
              size="lg"
              className="max-lg:h-10 max-lg:px-6 max-lg:text-sm"
            >
              {dict.hero.ctaPrimary}
            </Button>
          </div>
        </div>

        <HeroCarousel slides={carouselSlides} label={carouselLabel} />
      </Container>
    </section>
  );
}
