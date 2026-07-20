import { PackageX, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { searchProducts } from "@/lib/data";
import { alternateSearchPath, contactPath } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { PageHeader } from "../layout/PageHeader";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { ProductCard } from "../product/ProductCard";

export async function SearchResultsPage({
  locale,
  query,
}: {
  locale: Locale;
  query: string;
}) {
  const dict = getDictionary(locale);
  const trimmed = query.trim();
  const products = trimmed ? await searchProducts(trimmed) : [];
  const alternateHref = alternateSearchPath(locale);

  const countLine = dict.search.resultsForTemplate
    .replace("{count}", String(products.length))
    .replace("{query}", trimmed);

  return (
    <>
      <Header locale={locale} alternateHref={alternateHref} />
      <main>
        <PageHeader
          locale={locale}
          items={[{ label: dict.breadcrumb.products }, { label: dict.search.heading }]}
          title={dict.search.heading}
        />
        <Container className="pb-8 sm:pb-12">
          {!trimmed ? (
            <p className="text-muted">{dict.search.enterTerm}</p>
          ) : (
            <>
              <p className="text-sm text-muted">{countLine}</p>
              {products.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                  {products.map((product, i) => (
                    <Reveal key={product.slug} delay={(i % 4) * 75} className="h-full">
                      <ProductCard product={product} locale={locale} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center gap-4 rounded-button border border-line bg-surface px-6 py-16 text-center">
                  <PackageX className="size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
                  <p className="max-w-md text-ink">
                    {dict.search.emptyHeadingTemplate.replace("{query}", trimmed)}
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-3">
                    <Button href={contactPath(locale)} variant="primary" size="md">
                      {dict.category.emptyContactCta}
                    </Button>
                    <Button href="tel:+38220260528" variant="secondary" size="md">
                      <Phone className="size-4" strokeWidth={2} aria-hidden="true" />
                      {dict.category.emptyCallCta}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}
