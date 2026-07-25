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
 * The last two are downloaded local files (public/categories/) rather than
 * remote Unsplash hotlinks — drop a replacement at the same path to swap them.
 */
const categoryImages: Record<string, string> = {
  "alati-i-oprema": "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop&q=80",
  "masine-i-agregati": "https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=400&h=400&fit=crop&q=80",
  "basta-i-eksterijer": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&q=80",
  "zastita-na-radu-htz": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop&q=80",
  "gradjevina-ograde-i-okov": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop&q=80",
  "dom-kupatilo-i-vodovod": "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop&q=80",
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
