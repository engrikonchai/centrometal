import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { brands } from "@/lib/brands";
import { getPrimaryCategoryForBrand } from "@/lib/products";
import { getCategoryBySlug, categories } from "@/lib/taxonomy";
import { categoryPath, otherLocalePathFor } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { PageHeader } from "../layout/PageHeader";
import { Container } from "../ui/Container";
import { Card } from "../ui/Card";
import { BrandMark } from "../ui/BrandMark";

export function BrandsPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} alternateHref={otherLocalePathFor(locale, "brands")} />
      <main>
        <PageHeader
          locale={locale}
          items={[{ label: dict.nav.brands }]}
          title={dict.brandsPage.heading}
          intro={dict.brandsPage.intro}
        />
        <Container className="pb-16 sm:pb-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => {
              const primaryCategorySlug = getPrimaryCategoryForBrand(brand.slug) ?? categories[0].slug.mne;
              const category = getCategoryBySlug("mne", primaryCategorySlug)!;
              const hasProducts = getPrimaryCategoryForBrand(brand.slug) !== undefined;
              const href = `${categoryPath(locale, category.slug[locale])}?brand=${brand.slug}`;

              return (
                <Card key={brand.slug} className="p-6">
                  <Link href={href} className="flex h-full flex-col gap-4">
                    <BrandMark name={brand.name} logo={brand.logo} className="self-start px-4 py-2.5 text-sm" />
                    <p className="flex-1 text-sm text-muted">{brand.descriptor[locale]}</p>
                    <span className="text-sm font-semibold text-navy transition hover:text-teal">
                      {hasProducts ? dict.brandsPage.viewProducts : dict.brandsPage.noProductsYet} →
                    </span>
                  </Link>
                </Card>
              );
            })}
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}
