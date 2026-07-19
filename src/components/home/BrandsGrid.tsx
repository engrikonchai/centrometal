import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { brands } from "@/lib/brands";
import { brandsPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { BrandMark } from "../ui/BrandMark";
import { Button } from "../ui/Button";

export function BrandsGrid({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          heading={dict.brandsSection.heading}
          subheading={dict.brandsSection.subheading}
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {brands.map((brand) => (
            <BrandMark key={brand.slug} name={brand.name} className="px-5 py-3 text-sm" />
          ))}
          <span className="inline-flex items-center px-3 py-3 text-sm font-semibold text-muted">
            {locale === "mne" ? "+ 20 drugih brendova" : "+ 20 more brands"}
          </span>
        </div>
        <div className="mt-10 flex justify-center">
          <Button href={brandsPath(locale)} variant="secondary" size="md">
            {dict.brandsSection.viewAll}
          </Button>
        </div>
      </Container>
    </section>
  );
}
