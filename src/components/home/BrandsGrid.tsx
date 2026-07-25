import { clsx } from "clsx";
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

/** Rendered twice back-to-back so the marquee loop (-50%) wraps seamlessly. */
function MarqueeBrand({ brand, isAnchor, duplicate }: { brand: (typeof brands)[number]; isAnchor: boolean; duplicate?: boolean }) {
  return (
    <div className="group shrink-0" aria-hidden={duplicate || undefined}>
      <span data-testid={duplicate ? undefined : "brand-logo"}>
        <BrandMark
          name={brand.name}
          logo={brand.logo}
          className={isAnchor ? "h-20 w-28 text-sm" : "h-14 w-20 text-xs"}
          imageClassName={clsx(
            isAnchor ? "h-8 w-20" : "h-5 w-12",
            "grayscale transition duration-300 group-hover:grayscale-0",
          )}
        />
      </span>
    </div>
  );
}

export function BrandsGrid({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy to-steel py-16 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          invert
          heading={dict.brandsSection.heading}
        />
      </Container>
      <Reveal className="brand-marquee-viewport no-scrollbar mt-12 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="brand-marquee-track flex w-max items-center gap-10 py-1">
          {brands.map((brand) => (
            <MarqueeBrand key={brand.slug} brand={brand} isAnchor={anchorBrandSlugs.has(brand.slug)} />
          ))}
          {brands.map((brand) => (
            <MarqueeBrand key={`${brand.slug}-dup`} brand={brand} isAnchor={anchorBrandSlugs.has(brand.slug)} duplicate />
          ))}
        </div>
      </Reveal>
      <Container>
        <p className="mt-6 text-center text-sm font-semibold text-white/60">
          {locale === "mne" ? "+ 20 drugih brendova" : "+ 20 more brands"}
        </p>
        <div className="mt-8 flex justify-center">
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
