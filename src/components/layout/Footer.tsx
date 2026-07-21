import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import {
  aboutPath,
  brandsPath,
  categoryPath,
  contactPath,
  homePath,
  servicePath,
  wholesalePath,
} from "@/lib/paths";
import { categories } from "@/lib/taxonomy";
import { Container } from "../ui/Container";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <footer className="bg-navy text-white">
      <Container className="grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Link href={homePath(locale)} className="font-heading text-xl font-bold uppercase tracking-wide">
            Centrometal
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            {locale === "mne"
              ? "Ovlašćeni distributer alata, mašina i opreme u Podgorici, Crna Gora."
              : "Authorized distributor of tools, machinery and equipment in Podgorica, Montenegro."}
          </p>
        </div>

        <div>
          <h3 className="text-label font-semibold uppercase tracking-wide text-white/60">
            {dict.footer.productsHeading}
          </h3>
          <ul className="mt-4 space-y-2">
            {categories.slice(0, 6).map((category) => (
              <li key={category.slug.mne}>
                <Link
                  href={categoryPath(locale, category.slug[locale])}
                  className="text-sm text-white/85 transition hover:text-teal-on-dark"
                >
                  {category.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-label font-semibold uppercase tracking-wide text-white/60">
            {dict.footer.companyHeading}
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href={brandsPath(locale)} className="text-sm text-white/85 transition hover:text-teal-on-dark">
                {dict.nav.brands}
              </Link>
            </li>
            <li>
              <Link href={wholesalePath(locale)} className="text-sm text-white/85 transition hover:text-teal-on-dark">
                {dict.nav.wholesale}
              </Link>
            </li>
            <li>
              <Link href={servicePath(locale)} className="text-sm text-white/85 transition hover:text-teal-on-dark">
                {dict.nav.service}
              </Link>
            </li>
            <li>
              <Link href={aboutPath(locale)} className="text-sm text-white/85 transition hover:text-teal-on-dark">
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link href={contactPath(locale)} className="text-sm text-white/85 transition hover:text-teal-on-dark">
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-label font-semibold uppercase tracking-wide text-white/60">
            {dict.footer.contactHeading}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal" strokeWidth={2} aria-hidden="true" />
              <span>Bulevar 21. Maja broj 23, 81000 Podgorica</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-teal" strokeWidth={2} aria-hidden="true" />
              <a href="tel:+38220260528" className="transition hover:text-teal-on-dark">
                +382 20 260 528
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-teal" strokeWidth={2} aria-hidden="true" />
              <a href="tel:+38269372823" className="transition hover:text-teal-on-dark">
                +382 69 372 823
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-teal" strokeWidth={2} aria-hidden="true" />
              <a href="mailto:info@centrometal.me" className="transition hover:text-teal-on-dark">
                info@centrometal.me
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-steel py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-sm text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Centrometal D.O.O. {dict.footer.rights}</p>
        </Container>
      </div>
    </footer>
  );
}
