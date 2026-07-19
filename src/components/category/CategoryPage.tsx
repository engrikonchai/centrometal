import { Suspense } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import type { Category } from "@/lib/taxonomy";
import { getProductsByCategory } from "@/lib/data";
import { alternateCategoryPath } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { PageHeader } from "../layout/PageHeader";
import { Container } from "../ui/Container";
import { CategoryBrowser } from "./CategoryBrowser";
import { RelatedCategories } from "./RelatedCategories";

export async function CategoryPage({
  locale,
  category,
}: {
  locale: Locale;
  category: Category;
}) {
  const dict = getDictionary(locale);
  const products = await getProductsByCategory(category.slug.mne);
  const alternateHref = alternateCategoryPath(locale, category.slug.mne, category.slug.en);

  return (
    <>
      <Header locale={locale} alternateHref={alternateHref} />
      <main>
        <PageHeader
          locale={locale}
          items={[{ label: dict.breadcrumb.products }, { label: category.name[locale] }]}
          title={category.name[locale]}
          intro={category.intro[locale]}
        />
        <Container className="pb-8 sm:pb-12">
          <Suspense fallback={null}>
            <CategoryBrowser locale={locale} categorySlug={category.slug.mne} products={products} />
          </Suspense>
        </Container>
        <RelatedCategories locale={locale} current={category} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
