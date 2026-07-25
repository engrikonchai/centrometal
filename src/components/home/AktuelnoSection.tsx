import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

/**
 * Stock photography stand-in for real category photos (per global redesign
 * brief) — one image per department, keyed by the MNE slug. Once the category
 * "tileImage" field is populated in Sanity these become the fallback.
 * Departments without a stand-in photo render a branded gradient + icon tile.
 *
 * All are local files under public/categories/ (filename = department slug), so
 * the homepage has no remote image dependencies — drop a replacement at the
 * same path to swap any tile.
 */
const categoryImages: Record<string, string> = {
  "alati-i-oprema": "/categories/alati-i-oprema.jpg",
  "masine-i-agregati": "/categories/masine-i-agregati.jpg",
  "basta-i-eksterijer": "/categories/basta-i-eksterijer.jpg",
  "zastita-na-radu-htz": "/categories/zastita-na-radu-htz.jpg",
  "gradjevina-ograde-i-okov": "/categories/gradjevina-ograde-i-okov.jpg",
  "dom-kupatilo-i-vodovod": "/categories/dom-kupatilo-i-vodovod.jpg",
  "skladistenje-i-sigurnost": "/categories/skladistenje-i-sigurnost.jpg",
  "boje-i-zavrsni-radovi": "/categories/boje-i-zavrsni-radovi.jpg",
};

export function AktuelnoSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading heading={dict.aktuelno.heading} />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((category, i) => {
            const image = categoryImages[category.slug.mne];
            const Icon = category.icon;
            return (
              <Reveal key={category.slug.mne} delay={(i % 4) * 75}>
                <Link
                  href={categoryPath(locale, category.slug[locale])}
                  className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-navy transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {image ? (
                    <>
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition duration-200 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 grid place-items-center bg-linear-to-br from-navy to-teal"
                      aria-hidden="true"
                    >
                      <Icon className="size-12 text-white/25 transition duration-200 group-hover:scale-105" strokeWidth={1.5} />
                    </div>
                  )}
                  <h3 className="absolute inset-x-0 bottom-0 p-3 font-heading text-sm font-semibold leading-tight text-white lg:p-4 lg:text-lg">
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
