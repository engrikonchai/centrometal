import { Hammer, Wrench, Zap, Drill } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categoryPath, wholesalePath } from "@/lib/paths";
import { categories } from "@/lib/taxonomy";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

export function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const firstCategoryHref = categoryPath(locale, categories[0].slug[locale]);

  return (
    <section className="bg-navy text-white">
      <Container className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="text-label font-semibold uppercase tracking-wide text-orange-on-dark">
            {dict.hero.eyebrow}
          </p>
          <h1 className="mt-4 font-heading text-h1 font-bold leading-[1.05]">
            {dict.hero.headline}
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/80">{dict.hero.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={firstCategoryHref} variant="primary" size="lg">
              {dict.hero.ctaPrimary}
            </Button>
            <Button
              href={wholesalePath(locale)}
              variant="secondary"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-navy"
            >
              {dict.hero.ctaSecondary}
            </Button>
          </div>
        </div>

        {/* Placeholder for real product/store photography — see brief: "real photography not carousel". */}
        <div
          role="img"
          aria-label={
            locale === "mne"
              ? "Prodavnica i skladište alata Centrometal"
              : "Centrometal tool store and warehouse"
          }
          className="relative isolate aspect-[4/3] overflow-hidden rounded-button border border-steel bg-steel"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,var(--color-orange)_45%,var(--color-orange)_47%,transparent_47%)]" />
          <div className="grid h-full grid-cols-2 gap-px bg-steel p-px">
            {[Wrench, Drill, Zap, Hammer].map((Icon, i) => (
              <div key={i} className="flex items-center justify-center bg-navy">
                <Icon className="size-12 text-white/25" strokeWidth={1.25} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
