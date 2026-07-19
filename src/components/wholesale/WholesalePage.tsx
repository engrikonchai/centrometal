import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { otherLocalePathFor } from "@/lib/paths";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { PageHeader } from "../layout/PageHeader";
import { Container } from "../ui/Container";
import { Card } from "../ui/Card";
import { WholesaleForm } from "../forms/WholesaleForm";

export function WholesalePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} alternateHref={otherLocalePathFor(locale, "wholesale")} />
      <main>
        <PageHeader
          locale={locale}
          items={[{ label: dict.nav.wholesale }]}
          title={dict.wholesalePage.heading}
          intro={dict.wholesalePage.intro}
        />

        <Container className="pb-16 sm:pb-24">
          <h2 className="font-heading text-h3 font-semibold text-navy">
            {dict.wholesalePage.stepsHeading}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {dict.wholesalePage.steps.map((step, i) => (
              <Card key={step.title} className="p-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </Card>
            ))}
          </div>
        </Container>

        <div className="border-t border-line bg-surface py-16 sm:py-24">
          <Container className="max-w-2xl">
            <h2 className="font-heading text-h2 font-bold text-navy">{dict.wholesalePage.formHeading}</h2>
            <div className="mt-8">
              <WholesaleForm locale={locale} />
            </div>
          </Container>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
