import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

/** Only the first 6 taxonomy categories are shown here — see build brief's AKTUELNO tile count. */
const aktuelnoCategories = categories.slice(0, 6);

export function AktuelnoSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading heading={dict.aktuelno.heading} />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {aktuelnoCategories.map((category, i) => {
            const Icon = category.icon;
            return (
              <Reveal key={category.slug.mne} delay={(i % 3) * 75}>
                <Link
                  href={categoryPath(locale, category.slug[locale])}
                  className="group relative flex aspect-square w-full flex-col items-start justify-between overflow-hidden rounded-lg bg-teal p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg lg:p-5"
                >
                  <Icon
                    className="size-8 text-white/90 transition duration-200 group-hover:scale-105 lg:size-10"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="font-heading text-sm font-semibold leading-tight text-white lg:text-lg">
                    {category.name[locale]}
                  </h3>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
