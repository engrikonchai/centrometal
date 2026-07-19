import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories, type Category } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { Card } from "../ui/Card";

export function RelatedCategories({
  locale,
  current,
}: {
  locale: Locale;
  current: Category;
}) {
  const dict = getDictionary(locale);
  const related = categories.filter((c) => c.slug.mne !== current.slug.mne).slice(0, 4);

  return (
    <section className="border-t border-line py-16">
      <Container>
        <h2 className="font-heading text-h3 font-semibold text-navy">
          {dict.category.relatedHeading}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {related.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.slug.mne}>
                <Link
                  href={categoryPath(locale, category.slug[locale])}
                  className="flex flex-col items-start gap-3 p-5"
                >
                  <Icon className="size-6 text-orange" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-sm font-semibold text-navy">{category.name[locale]}</span>
                </Link>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
