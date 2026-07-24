import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getOnSaleProducts } from "@/lib/data";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { ProductCard } from "../product/ProductCard";

/** Homepage-only. Renders nothing if no seed/CMS product is flagged onSale. */
export async function ProductsOnSale({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const onSale = await getOnSaleProducts();
  if (onSale.length === 0) return null;

  const firstCategory = getCategoryBySlug("mne", onSale[0].categorySlug);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading heading={dict.onSale.heading} />
        <div className="no-scrollbar mt-10 flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden scroll-px-4 [touch-action:pan-x] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
          {onSale.map((product, i) => (
            <Reveal
              key={product.slug}
              delay={(i % 4) * 75}
              className="h-full w-[42%] shrink-0 snap-start sm:w-[38%] lg:w-auto lg:shrink"
            >
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>
        {firstCategory && (
          <div className="mt-10 flex justify-center">
            <Button href={categoryPath(locale, firstCategory.slug[locale])} variant="secondary" size="md">
              {dict.onSale.viewAll} →
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
