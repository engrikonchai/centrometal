import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categoryPath } from "@/lib/paths";
import { categories } from "@/lib/taxonomy";
import { getFeaturedProducts } from "@/lib/data";
import { getBrandBySlug } from "@/lib/brands";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import { Container } from "../ui/Container";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";
import { HeroSearch } from "./HeroSearch";

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
      <Container className="relative grid grid-cols-1 gap-5 pt-5 pb-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-24">
        {/* Extra horizontal breathing room on phones (px-1) so the smaller
            headline no longer wraps hard against the screen edges. */}
        <div className="max-lg:px-1">
          <p className="font-heading text-2xl font-bold uppercase tracking-[0.18em] text-white lg:text-3xl">
            Centro<span className="text-teal-on-dark">metal</span>
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-teal-on-dark lg:mt-4 lg:text-sm">
            {dict.hero.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-[1.5rem] font-bold leading-[1.28] [text-shadow:0_2px_10px_rgba(0,0,0,0.35)] lg:mt-4 lg:text-[4.5rem] lg:leading-[1.02]">
            {dict.hero.headline}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 lg:mt-6 lg:text-lg">
            {dict.hero.subhead}
          </p>
          <div className="mt-5 lg:mt-8">
            <HeroSearch locale={locale} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={firstCategoryHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-white/40 px-6 text-label font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy active:brightness-90 lg:min-h-12 lg:px-8"
            >
              {dict.hero.ctaPrimary}
            </Link>
          </div>
        </div>

        {/*
          On phones the carousel reads as its own deliberate section: a labelled
          strip set off from the CTA above by a top divider + spacing, rather
          than leftover space. Desktop (lg:) drops the divider/label and keeps
          the original side-by-side layout untouched.
        */}
        <div className="max-lg:border-t max-lg:border-white/10 max-lg:pt-4">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-on-dark lg:hidden">
            {carouselLabel}
          </p>
          <HeroCarousel slides={carouselSlides} label={carouselLabel} />
        </div>
      </Container>
    </section>
  );
}
