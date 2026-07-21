import { BadgeCheck, MapPin, Wrench } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { otherLocalePathFor } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { PageHeader } from "../layout/PageHeader";
import { Container } from "../ui/Container";
import { LocationsSection } from "../shared/LocationsSection";

export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const stats = [
    { icon: MapPin, value: "2", label: dict.aboutPage.statsLocations },
    { icon: BadgeCheck, value: "30+", label: dict.aboutPage.statsBrands },
    { icon: Wrench, value: "1", label: dict.aboutPage.statsService },
  ];

  return (
    <>
      <Header locale={locale} alternateHref={otherLocalePathFor(locale, "about")} />
      <main>
        <PageHeader
          locale={locale}
          items={[{ label: dict.nav.about }]}
          title={dict.aboutPage.heading}
          intro={dict.aboutPage.intro}
        />

        <Container className="pb-16 sm:pb-24">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-button border border-line bg-surface p-6 text-center">
                <Icon className="mx-auto size-6 text-teal" strokeWidth={1.75} aria-hidden="true" />
                <p className="mt-3 font-heading text-h2 font-bold text-navy">{value}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="font-heading text-h2 font-bold text-navy">{dict.aboutPage.storyHeading}</h2>
            <div className="mt-6 space-y-4">
              {dict.aboutPage.storyParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-ink">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>

        <LocationsSection
          locale={locale}
          heading={dict.aboutPage.locationsHeading}
          subheading={dict.locations.subheading}
          className="border-t border-line bg-surface py-16 sm:py-24"
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
