import Image from "next/image";
import { Phone } from "lucide-react";
import { otherLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import type { Product } from "@/lib/products";
import { getRelatedProducts } from "@/lib/data";
import { getBrandBySlug } from "@/lib/brands";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { categoryPath, productPath } from "@/lib/paths";
import { SALES_PHONE, telHref } from "@/lib/contact";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { Breadcrumb } from "../layout/Breadcrumb";
import { Container } from "../ui/Container";
import { ProductGallery } from "./ProductGallery";
import { SpecSummary } from "./SpecSummary";
import { SpecTable } from "./SpecTable";
import { DocumentationCards } from "./DocumentationCards";
import { RelatedProducts } from "./RelatedProducts";
import { AddToInquiryButton } from "./AddToInquiryButton";
import { ProductStickyBar } from "./ProductStickyBar";

/**
 * Product detail. Mobile is a single column ending in a sticky action bar;
 * desktop is a 2-column image/details split with the full spec table
 * full-width below and a 5-column related grid at the bottom.
 */
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
  const categoryHref = categoryPath(locale, category.slug[locale]);
  const subcategory = category.subcategories.find(
    (sub) => sub.slug.mne === product.subcategorySlug,
  );
  const specs = product.specs ?? [];
  const hasDocs = Boolean(product.specPdfUrl || product.manufacturerUrl);
  const badge = product.onSale
    ? dict.featured.onSaleBadge
    : product.isNew
      ? dict.featured.newBadge
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description[locale],
    category: category.name[locale],
    ...(brand && { brand: { "@type": "Brand", name: brand.name } }),
  };

  const meta = [subcategory?.name[locale], dict.featured.priceOnRequest]
    .filter(Boolean)
    .join(" · ");

  /* Shared by the mobile column and the tablet/desktop details panel. */
  const identity = (
    <>
      <div className="flex items-center gap-2.5">
        {brand?.logo ? (
          <span className="relative block h-[15px] w-[70px] md:h-[17px] md:w-[78px]">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              quality={95}
              sizes="156px"
              className="object-contain object-left"
            />
          </span>
        ) : (
          brand && <span className="text-sm font-semibold text-muted">{brand.name}</span>
        )}
        {badge && (
          <span className="rounded-full bg-teal/[0.12] px-2.5 py-[3px] text-xs font-semibold text-teal-ink md:px-[11px] md:py-[5px] md:text-[0.8125rem]">
            {badge}
          </span>
        )}
      </div>

      <h1 className="mt-2 text-balance text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] md:mt-3 md:text-[2rem] md:leading-[1.1] xl:text-[2.5rem]">
        {product.name}
      </h1>
      <p className="mt-1 text-[0.9375rem] text-muted md:mt-2 md:text-[1.03125rem]">{meta}</p>
    </>
  );

  return (
    <>
      {/* JSON.stringify of a typed object constructed above, not user input. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header
        locale={locale}
        alternateHref={alternateHref}
        mobile={{ backHref: categoryHref }}
        tablet={{
          /* Tablet puts the breadcrumb in the sticky header rather than in
             page content, so the trail back to the category survives scrolling
             — the tablet handoff's one deliberate divergence from desktop. */
          breadcrumb: (
            <Breadcrumb
              locale={locale}
              showHome={false}
              items={[
                { label: dict.breadcrumb.products },
                { label: category.name[locale], href: categoryHref },
                { label: product.name },
              ]}
            />
          ),
        }}
      />

      <main className="flex-1">
        <Container className="hidden pt-8 xl:block">
          <Breadcrumb
            locale={locale}
            showHome={false}
            items={[
              { label: dict.breadcrumb.products },
              { label: category.name[locale], href: categoryHref },
              { label: product.name },
            ]}
          />
        </Container>

        {/*
          Tablet: one intrinsic auto-fit grid does both orientations — gallery
          beside details in landscape (1194px fits two 330px+ tracks), stacked
          in portrait. Desktop keeps its fixed 2-column split.
        */}
        <Container className="pt-3 md:grid md:grid-cols-[repeat(auto-fit,minmax(330px,1fr))] md:items-start md:gap-7 md:pt-[22px] xl:grid-cols-2 xl:gap-12 xl:pt-8">
          <ProductGallery
            alt={`${brand?.name ?? ""} ${product.name}`.trim()}
            icon={category.icon}
            image={product.image}
            localImage={product.localImage}
            additionalImages={product.additionalImages}
          />

          <div className="pt-4 md:pt-0">
            {identity}

            {/*
              Order flips at the breakpoint: mobile puts the spec tiles
              directly under the title, tablet and desktop lead with the
              description. Flexbox `order` keeps it to one DOM node per element.
            */}
            <div className="mt-3.5 flex flex-col md:mt-0">
              {specs.length > 0 && (
                <div className="order-1 md:order-2 md:mt-[22px] xl:mt-6 xl:max-w-[460px]">
                  <SpecSummary specs={specs} locale={locale} />
                </div>
              )}
              <p className="order-2 mt-4 text-base leading-[1.5] text-muted md:order-1 md:mt-[18px] md:text-[1.03125rem] md:leading-[1.55] xl:mt-5 xl:max-w-[460px]">
                {product.description[locale]}
              </p>
            </div>

            {/*
              Inline CTA pair for tablet and desktop — only mobile uses the
              sticky bottom bar. At tablet these sit above the fold at 834px,
              which is why the handoff drops the sticky bar here. 14px-radius
              54px rectangles with an outlined (not soft-filled) call button;
              they wrap rather than shrink in portrait.
            */}
            <div className="mt-6 hidden flex-wrap gap-2.5 md:flex xl:mt-8 xl:flex-nowrap xl:gap-3">
              <AddToInquiryButton
                product={product}
                locale={locale}
                className="h-[54px]! rounded-[14px]! px-[30px]! text-[1.03125rem]! xl:w-[260px] xl:text-base!"
              />
              <a
                href={telHref(SALES_PHONE)}
                className="flex h-[54px] items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-navy/15 px-6 text-[1.03125rem] font-semibold text-navy transition hover:border-navy/30 hover:bg-navy/[0.03] xl:px-[26px] xl:text-base"
              >
                <Phone className="size-[17px] text-teal" strokeWidth={2.1} aria-hidden="true" />
                {dict.nav.call}
              </a>
            </div>

            {/* Wrapper is conditional too — otherwise the divider rule renders
                on its own for every product that has no documents (currently
                all of them). */}
            {hasDocs && (
              <div className="mt-6 hidden border-t border-navy/[0.08] pt-[22px] md:block xl:mt-7 xl:pt-7">
                <DocumentationCards product={product} locale={locale} layout="inline" />
              </div>
            )}
          </div>
        </Container>

        {specs.length > 0 && (
          <Container className="pt-[22px] md:pt-11 xl:pt-16">
            <h2 className="mb-2.5 text-h2 font-bold md:text-[1.625rem] md:tracking-[-0.03em] xl:text-h2-lg">
              {dict.product.specsCardHeading}
            </h2>
            <SpecTable specs={specs} locale={locale} />
          </Container>
        )}

        {/* Mobile position for the documentation cards — tablet and desktop
            carry them inline in the details column instead. */}
        {hasDocs && (
          <Container className="pt-[22px] md:hidden">
            <DocumentationCards product={product} locale={locale} />
          </Container>
        )}

        <Container className="px-0 pb-2 md:px-0 md:pb-14 xl:px-8 xl:pb-16">
          <RelatedProducts locale={locale} products={related} categorySlug={product.categorySlug} />
        </Container>
      </main>

      <ProductStickyBar product={product} locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
