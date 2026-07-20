import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

/**
 * Per-category dark gradients (navy -> an on-brand accent) standing in for
 * real category photography — see build brief's "if real category photos
 * aren't available, use per-category CSS gradients" fallback.
 */
const categoryGradients: Record<string, string> = {
  "alati-i-oprema": "linear-gradient(135deg, #1c2b36 0%, #2e4756 100%)",
  "masine-i-agregati": "linear-gradient(135deg, #1c2b36 0%, #4a3420 100%)",
  "basta-i-eksterijer": "linear-gradient(135deg, #1c2b36 0%, #2f4a3a 100%)",
  "zastita-na-radu-htz": "linear-gradient(135deg, #1c2b36 0%, #5c4a1a 100%)",
  "gradjevina-ograde-i-okov": "linear-gradient(135deg, #1c2b36 0%, #3d3f42 100%)",
  "dom-kupatilo-i-vodovod": "linear-gradient(135deg, #1c2b36 0%, #234152 100%)",
  "skladistenje-i-sigurnost": "linear-gradient(135deg, #1c2b36 0%, #12181f 100%)",
  "boje-i-zavrsni-radovi": "linear-gradient(135deg, #1c2b36 0%, #5c1f1f 100%)",
};

export function CategoryTiles({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading heading={dict.categories.heading} subheading={dict.categories.subheading} />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => {
            const Icon = category.icon;
            return (
              <Reveal key={category.slug.mne} delay={(i % 4) * 75}>
                <Link
                  href={categoryPath(locale, category.slug[locale])}
                  className="group relative flex h-full flex-col items-start gap-4 overflow-hidden rounded-lg p-6 transition hover:-translate-y-0.5"
                  style={{ background: categoryGradients[category.slug.mne] }}
                >
                  <div
                    className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10"
                    aria-hidden="true"
                  />
                  <Icon className="relative size-8 text-white" strokeWidth={1.5} aria-hidden="true" />
                  <span className="relative font-heading text-lg font-semibold leading-tight text-white">
                    {category.name[locale]}
                  </span>
                  <span className="relative mt-auto inline-flex items-center gap-1 text-sm font-semibold text-white/85 transition group-hover:text-orange-on-dark">
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
