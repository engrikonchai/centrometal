import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { getNewProducts } from "@/lib/data";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { ProductCard } from "../product/ProductCard";

/**
 * Homepage "Novo u ponudi" (new arrivals). Off-white background + navy "Novo"
 * badges (vs. the white background + teal "Na popustu" badges of ProductsOnSale)
 * so the two product rows read as distinct sections. Renders nothing if no
 * product is flagged isNew. On-sale items are already excluded upstream.
 */
export async function NewArrivals({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = await getNewProducts();
  if (items.length === 0) return null;

  return (
    <section className="bg-warehouse py-16 sm:py-24">
      <Container>
        <SectionHeading heading={dict.newArrivals.heading} />
        <div className="no-scrollbar mt-10 flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden scroll-px-4 [touch-action:pan-x] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
          {items.map((product, i) => (
            <Reveal
              key={product.slug}
              delay={(i % 4) * 75}
              className="h-full w-[42%] shrink-0 snap-start sm:w-[38%] lg:w-auto lg:shrink"
            >
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
