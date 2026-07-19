import { Suspense } from "react";
import { Mail, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { otherLocalePathFor } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { PageHeader } from "../layout/PageHeader";
import { Container } from "../ui/Container";
import { LocationsSection } from "../shared/LocationsSection";
import { ContactForm } from "../forms/ContactForm";

export function ContactPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} alternateHref={otherLocalePathFor(locale, "contact")} />
      <main>
        <PageHeader
          locale={locale}
          items={[{ label: dict.nav.contact }]}
          title={dict.contactPage.heading}
          intro={dict.contactPage.intro}
        />

        <Container className="pb-16 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-3">
              <a
                href="tel:+38220260528"
                className="flex items-center gap-3 rounded-button border border-line bg-surface p-4 text-sm font-semibold text-navy transition hover:border-orange"
              >
                <Phone className="size-5 shrink-0 text-orange" strokeWidth={2} aria-hidden="true" />
                +382 20 260 528
              </a>
              <a
                href="tel:+38269372823"
                className="flex items-center gap-3 rounded-button border border-line bg-surface p-4 text-sm font-semibold text-navy transition hover:border-orange"
              >
                <Phone className="size-5 shrink-0 text-orange" strokeWidth={2} aria-hidden="true" />
                +382 69 372 823
              </a>
              <a
                href="mailto:info@centrometal.me"
                className="flex items-center gap-3 rounded-button border border-line bg-surface p-4 text-sm font-semibold text-navy transition hover:border-orange"
              >
                <Mail className="size-5 shrink-0 text-orange" strokeWidth={2} aria-hidden="true" />
                info@centrometal.me
              </a>
            </div>

            <div>
              <h2 className="font-heading text-h3 font-semibold text-navy">{dict.contactPage.formHeading}</h2>
              <div className="mt-6">
                <Suspense fallback={null}>
                  <ContactForm locale={locale} />
                </Suspense>
              </div>
            </div>
          </div>
        </Container>

        <LocationsSection
          locale={locale}
          heading={dict.contactPage.locationsHeading}
          subheading={dict.locations.subheading}
          className="border-t border-line bg-surface py-16 sm:py-24"
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
