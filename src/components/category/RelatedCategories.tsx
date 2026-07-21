import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories, type Category } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { Card } from "../ui/Card";
import { Reveal } from "../ui/Reveal";

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
          {related.map((category, i) => {
            const Icon = category.icon;
            return (
              <Reveal key={category.slug.mne} delay={(i % 4) * 75} className="h-full">
                <Card className="h-full">
                  <Link
                    href={categoryPath(locale, category.slug[locale])}
                    className="flex flex-col items-start gap-3 p-5"
                  >
                    <Icon className="size-6 text-teal" strokeWidth={1.5} aria-hidden="true" />
                    <span className="text-sm font-semibold text-navy">{category.name[locale]}</span>
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
