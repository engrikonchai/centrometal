import type { Locale } from "@/lib/i18n";
import { format, getDictionary } from "@/lib/dictionary";
import type { Category } from "@/lib/taxonomy";
import { getProductsByCategory } from "@/lib/data";
import { alternateCategoryPath, homePath } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { Breadcrumb } from "../layout/Breadcrumb";
import { Container } from "../ui/Container";
import { CategoryBrowser } from "./CategoryBrowser";

/**
 * Category listing. Mobile gets a back/title/cart header and a full-bleed
 * column; desktop gets a breadcrumb, H1 + intro, and a two-column
 * sidebar/grid split. The browser itself handles both layouts.
 */
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
      <Header
        locale={locale}
        alternateHref={alternateHref}
        mobile={{ title: category.name[locale], backHref: homePath(locale) }}
        tablet={{
          activeCategorySlug: category.slug.mne,
          searchPlaceholder: format(dict.search.scopedTemplate, {
            category: category.name[locale],
          }),
        }}
      />

      <main className="flex-1">
        {/* Tablet + desktop page head — mobile carries the title in the header
            bar. Tablet uses a 34px H1 against desktop's 38px. */}
        <Container className="hidden pb-6 pt-6 md:block xl:pb-8 xl:pt-8">
          <Breadcrumb
            locale={locale}
            showHome={false}
            items={[{ label: dict.breadcrumb.products }, { label: category.name[locale] }]}
          />
          <h1 className="mt-3 text-balance text-[2.125rem] font-bold tracking-[-0.032em] xl:text-[2.375rem]">
            {category.name[locale]}
          </h1>
          <p className="mt-2.5 max-w-[560px] text-[1.03125rem] leading-[1.5] text-muted xl:text-base">
            {category.intro[locale]}
          </p>
        </Container>

        <Container className="px-0 pt-2.5 md:px-6 md:pb-14 md:pt-0 xl:px-8 xl:pb-16">
          {/* No Suspense boundary: it existed only to contain CategoryBrowser's
              useSearchParams call, which excluded the product grid from the
              prerender. The browser now hydrates filters from the URL itself. */}
          <CategoryBrowser locale={locale} categorySlug={category.slug.mne} products={products} />
        </Container>
      </main>

      <Footer locale={locale} />
    </>
  );
}
