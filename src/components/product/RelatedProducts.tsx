import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import type { Product } from "@/lib/products";
import { Container } from "../ui/Container";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({ locale, products }: { locale: Locale; products: Product[] }) {
  if (products.length === 0) return null;
  const dict = getDictionary(locale);

  return (
    <section className="border-t border-line py-16 sm:py-24">
      <Container>
        <h2 className="font-heading text-h3 font-semibold text-navy">{dict.product.relatedHeading}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}
