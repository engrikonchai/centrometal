import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { brands } from "@/lib/brands";
import { brandsPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { BrandMark } from "../ui/BrandMark";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

const anchorBrandSlugs = new Set(["bosch", "makita", "einhell", "telwin"]);

export function BrandsGrid({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="bg-navy py-16 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          invert
          heading={dict.brandsSection.heading}
          subheading={dict.brandsSection.subheading}
        />
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory items-center gap-x-6 gap-y-6 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:gap-x-10 sm:overflow-visible sm:pb-0">
          {brands.map((brand, i) => {
            const isAnchor = anchorBrandSlugs.has(brand.slug);
            return (
              <Reveal key={brand.slug} delay={(i % 6) * 50} className="shrink-0 snap-start">
                <span data-testid="brand-logo">
                  <BrandMark
                    name={brand.name}
                    logo={brand.logo}
                    className={
                      isAnchor
                        ? "h-20 w-28 text-sm transition hover:scale-105 hover:border-orange"
                        : "h-14 w-20 text-xs transition hover:scale-105 hover:border-orange"
                    }
                    imageClassName={isAnchor ? "h-8 w-20" : "h-5 w-12"}
                  />
                </span>
              </Reveal>
            );
          })}
          <span className="inline-flex shrink-0 items-center px-3 py-3 text-sm font-semibold text-white/60">
            {locale === "mne" ? "+ 20 drugih brendova" : "+ 20 more brands"}
          </span>
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            href={brandsPath(locale)}
            variant="secondary"
            size="md"
            className="border-white text-white hover:bg-white hover:text-navy"
          >
            {dict.brandsSection.viewAll}
          </Button>
        </div>
      </Container>
    </section>
  );
}
