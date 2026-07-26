import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { inquiryPath, otherLocalePathFor } from "@/lib/paths";
import { categories } from "@/lib/taxonomy";
import { brands } from "@/lib/brands";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { PageHeader } from "../layout/PageHeader";
import { Container } from "../ui/Container";
import { BrandMark } from "../ui/BrandMark";
import { StoresSection } from "../shared/StoresSection";
import { Button } from "../ui/Button";

/** Repairable-equipment categories only — safety/paint/storage aren't service-relevant. */
const SERVICEABLE_CATEGORY_SLUGS = ["alati-i-oprema", "masine-i-agregati", "basta-i-eksterijer"];

export function ServicePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const serviceableCategories = categories.filter((c) =>
    SERVICEABLE_CATEGORY_SLUGS.includes(c.slug.mne),
  );

  return (
    <>
      <Header locale={locale} alternateHref={otherLocalePathFor(locale, "service")} />
      <main>
        <PageHeader
          locale={locale}
          items={[{ label: dict.nav.service }]}
          title={dict.servicePage.heading}
          intro={dict.servicePage.intro}
        />

        <Container className="pb-16 sm:pb-24">
          <h2 className="font-heading text-h3 font-semibold text-navy">
            {dict.servicePage.whatWeServiceHeading}
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-label font-semibold uppercase tracking-wide text-muted">
                {dict.servicePage.categoriesLabel}
              </h3>
              <ul className="mt-3 space-y-2">
                {serviceableCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <li key={category.slug.mne} className="flex items-center gap-2.5 text-sm text-ink">
                      <Icon className="size-4 text-teal-ink" strokeWidth={1.75} aria-hidden="true" />
                      {category.name[locale]}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="text-label font-semibold uppercase tracking-wide text-muted">
                {dict.servicePage.brandsLabel}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {brands.map((brand) => (
                  <BrandMark key={brand.slug} name={brand.name} logo={brand.logo} className="px-3 py-1.5 text-xs" />
                ))}
              </div>
            </div>
          </div>
        </Container>

        <Container className="py-12 sm:py-16">
          <h2 className="text-h2 font-bold">{dict.servicePage.dropOffHeading}</h2>
          <p className="mt-2 max-w-2xl text-muted">{dict.servicePage.dropOffBody}</p>
          <div className="mt-6">
            <StoresSection locale={locale} showFullHours className="max-w-xl" />
          </div>

          {/* The service form is now part of the merged /upit flow, deep-linked
              to its Servis tab. */}
          <div className="mt-10">
            <Button href={inquiryPath(locale, "servis")} variant="primary" size="lg">
              {dict.servicePage.formHeading}
            </Button>
          </div>
        </Container>
      </main>
      <Footer locale={locale} />
    </>
  );
}
