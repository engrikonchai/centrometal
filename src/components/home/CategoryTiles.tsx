import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";

export function CategoryTiles({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading heading={dict.categories.heading} subheading={dict.categories.subheading} />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.slug.mne} className="group">
                <Link
                  href={categoryPath(locale, category.slug[locale])}
                  className="flex h-full flex-col items-start gap-4 p-6"
                >
                  <Icon className="size-8 text-orange" strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-heading text-lg font-semibold leading-tight text-navy">
                    {category.name[locale]}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-steel transition group-hover:text-orange">
                    <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                </Link>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
