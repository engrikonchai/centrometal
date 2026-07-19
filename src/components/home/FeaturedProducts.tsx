import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getFeaturedProducts } from "@/lib/data";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { ProductCard } from "../product/ProductCard";
import { categoryPath } from "@/lib/paths";

export async function FeaturedProducts({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const featured = await getFeaturedProducts();

  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading heading={dict.featured.heading} subheading={dict.featured.subheading} />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>
        {featured[0] &&
          (() => {
            const firstCategory = getCategoryBySlug("mne", featured[0].categorySlug);
            if (!firstCategory) return null;
            return (
              <div className="mt-10 flex justify-center">
                <Button
                  href={categoryPath(locale, firstCategory.slug[locale])}
                  variant="secondary"
                  size="md"
                >
                  {dict.featured.viewAll}
                </Button>
              </div>
            );
          })()}
      </Container>
    </section>
  );
}
