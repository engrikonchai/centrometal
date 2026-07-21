import { FileText, Phone, ExternalLink } from "lucide-react";
import { otherLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import type { Product } from "@/lib/products";
import { getRelatedProducts } from "@/lib/data";
import { getBrandBySlug } from "@/lib/brands";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { categoryPath, contactPath, productPath } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { Breadcrumb } from "../layout/Breadcrumb";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { BrandMark } from "../ui/BrandMark";
import { ProductGallery } from "./ProductGallery";
import { SpecSummary } from "./SpecSummary";
import { SpecTable } from "./SpecTable";
import { RelatedProducts } from "./RelatedProducts";
import { AddToCartButton } from "./AddToCartButton";

export async function ProductDetailPage({
  locale,
  product,
}: {
  locale: Locale;
  product: Product;
}) {
  const dict = getDictionary(locale);
  const category = getCategoryBySlug("mne", product.categorySlug)!;
  const brand = getBrandBySlug(product.brandSlug);
  const related = await getRelatedProducts(product);

  const alternateHref = productPath(
    otherLocale(locale),
    category.slug[otherLocale(locale)],
    product.slug,
  );
  const quoteHref = `${contactPath(locale)}?product=${encodeURIComponent(product.name)}`;
  const hasSpecs = Boolean(product.specs && product.specs.length > 0);
  const hasDownloads = Boolean(product.specPdfUrl || product.manufacturerUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description[locale],
    category: category.name[locale],
    ...(brand && { brand: { "@type": "Brand", name: brand.name } }),
  };

  return (
    <>
      {/* JSON.stringify of a typed object constructed above, not user input. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header locale={locale} alternateHref={alternateHref} />
      <main>
        <Container className="py-8 sm:py-12">
          <Breadcrumb
            locale={locale}
            items={[
              { label: dict.breadcrumb.products },
              { label: category.name[locale], href: categoryPath(locale, category.slug[locale]) },
              { label: product.name },
            ]}
          />

          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <ProductGallery
              alt={`${brand?.name ?? ""} ${product.name}`.trim()}
              icon={category.icon}
              image={product.image}
              localImage={product.localImage}
            />

            <div>
              {brand && <BrandMark name={brand.name} logo={brand.logo} className="px-3 py-1.5 text-sm" />}
              <h1 className="mt-3 font-heading text-h1 font-bold text-navy">{product.name}</h1>

              {hasSpecs && (
                <div className="mt-4">
                  <SpecSummary specs={product.specs!} locale={locale} />
                </div>
              )}

              <p className="mt-5 max-w-lg text-ink">{product.description[locale]}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <AddToCartButton
                  product={product}
                  label={dict.featured.addToCart}
                  addedLabel={dict.featured.addedToCart}
                />
                <Button href={quoteHref} variant="secondary" size="lg">
                  {dict.product.requestQuote}
                </Button>
                <Button href="tel:+38220260528" variant="secondary" size="lg">
                  <Phone className="size-4" strokeWidth={2} aria-hidden="true" />
                  {dict.product.callStore}
                </Button>
              </div>
            </div>
          </div>

          {hasSpecs && (
            <section className="mt-16 max-w-3xl">
              <h2 className="font-heading text-h3 font-semibold text-navy">
                {dict.product.specsHeading}
              </h2>
              <div className="mt-4">
                <SpecTable specs={product.specs!} locale={locale} />
              </div>
            </section>
          )}

          {hasDownloads && (
            <section className="mt-12 max-w-3xl">
              <h2 className="font-heading text-h3 font-semibold text-navy">
                {dict.product.downloadsHeading}
              </h2>
              <ul className="mt-4 space-y-2">
                {product.specPdfUrl && (
                  <li>
                    <a
                      href={product.specPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-teal"
                    >
                      <FileText className="size-4" strokeWidth={2} aria-hidden="true" />
                      {dict.product.specSheetLabel}
                    </a>
                  </li>
                )}
                {product.manufacturerUrl && (
                  <li>
                    <a
                      href={product.manufacturerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-teal"
                    >
                      <ExternalLink className="size-4" strokeWidth={2} aria-hidden="true" />
                      {dict.product.manufacturerLinkLabel}
                    </a>
                  </li>
                )}
              </ul>
            </section>
          )}
        </Container>

        <RelatedProducts locale={locale} products={related} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
