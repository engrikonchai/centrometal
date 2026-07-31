import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { format, getDictionary } from "@/lib/dictionary";
import { homePath, otherLocalePathFor } from "@/lib/paths";
import {
  EMAIL,
  HQ_ADDRESS,
  MOBILE_PHONE,
  SALES_PHONE,
  mailHref,
  telHref,
} from "@/lib/contact";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { Container } from "../ui/Container";
import { StoresSection } from "../shared/StoresSection";
import { WholesaleCtaCard } from "../shared/WholesaleCtaCard";

/**
 * Contact screen. Per the handoff this also carries the "O nama" content —
 * there is no separate About page anymore, and /o-nama redirects here.
 *
 * CLIENT REVIEW: the two "O nama" paragraphs are invented prototype copy and
 * need the client's real company story.
 */
export function ContactPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const contactRows = [
    {
      href: telHref(SALES_PHONE),
      label: `${dict.contactPage.salesLabel} — ${SALES_PHONE}`,
      Icon: Phone,
    },
    {
      href: telHref(MOBILE_PHONE),
      label: `${dict.contactPage.mobileLabel} — ${MOBILE_PHONE}`,
      Icon: Phone,
    },
    { href: mailHref, label: EMAIL, Icon: Mail },
  ];

  const stats = [
    { value: dict.contactPage.statStoresValue, label: dict.contactPage.statStoresLabel },
    { value: dict.contactPage.statBrandsValue, label: dict.contactPage.statBrandsLabel },
    { value: dict.contactPage.statServiceValue, label: dict.contactPage.statServiceLabel },
  ];

  return (
    <>
      <Header
        locale={locale}
        alternateHref={otherLocalePathFor(locale, "contact")}
        mobile={{ title: dict.contactPage.heading, backHref: homePath(locale) }}
        /* Kontakt is not a department, so its rail is the top-level site nav
           rather than the category chips. */
        tablet={{ rail: "sections", activeSection: "contact" }}
      />

      <main className="flex-1">
        <Container className="pt-3 md:pt-[34px] xl:pt-10">
          <div className="hidden md:block">
            <h1 className="text-[2.25rem] font-bold tracking-[-0.032em] xl:text-[2.5rem] xl:tracking-[-0.03em]">
              {dict.contactPage.heading}
            </h1>
            <p className="mt-3 max-w-[540px] text-[1.0625rem] leading-[1.5] text-muted xl:max-w-2xl xl:text-lg">
              {dict.contactPage.subtitle}
            </p>
          </div>

          {/* Quick actions. */}
          <div className="grid grid-cols-2 gap-2.5 md:mt-6 md:max-w-md xl:mt-8">
            <a
              href={telHref(SALES_PHONE)}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-teal text-[0.96875rem] font-semibold tracking-[-0.015em] text-white transition hover:bg-teal-hover md:text-base"
            >
              <Phone className="size-[17px]" strokeWidth={2} aria-hidden="true" />
              {dict.contactPage.callCta}
            </a>
            <a
              href={mailHref}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-teal/10 text-[0.96875rem] font-semibold tracking-[-0.015em] text-teal-ink transition hover:bg-teal/15 md:text-base"
            >
              <Mail className="size-[17px]" strokeWidth={2} aria-hidden="true" />
              {dict.contactPage.emailCta}
            </a>
          </div>
        </Container>

        {/*
          Contact details. Tablet lays the three rows out on an intrinsic 240px
          track — 3-up in landscape, 2-up in portrait — instead of the
          full-width stack mobile uses or the narrow sidebar column desktop
          gives it.
        */}
        <Container className="pt-5 md:pt-0 xl:grid xl:grid-cols-[1fr_2fr] xl:items-start xl:gap-12 xl:pt-14">
          <section className="md:pt-[26px] xl:pt-0">
            <h2 className="mb-2.5 text-h2 font-bold md:sr-only xl:not-sr-only xl:text-h2-lg">
              {dict.contactPage.contactHeading}
            </h2>
            <div className="flex flex-col gap-2 md:grid md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:gap-3 xl:flex xl:flex-col xl:gap-2">
              {contactRows.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-button bg-surface px-4 py-3.5 text-[1.03125rem] tracking-[-0.015em] text-ink shadow-card transition hover:shadow-[0_4px_12px_rgba(17,21,26,0.1)] md:min-h-[84px] md:gap-3.5 md:rounded-[20px] md:bg-fill md:p-[18px] md:shadow-none md:hover:bg-[#eeeff1] md:hover:shadow-none xl:min-h-0 xl:rounded-button xl:px-4 xl:py-3.5"
                >
                  <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-teal/10 md:size-[46px] md:rounded-[13px] xl:size-[34px] xl:rounded-[10px]">
                    <Icon
                      className="size-[17px] text-teal-ink md:size-[21px] xl:size-[17px]"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="flex-1">{label}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Store toggle sits on the H2 row at tablet, wrapping below it when
              the portrait column gets too narrow for both. */}
          <section className="pt-[22px] md:pt-10 xl:pt-0">
            <StoresSection
              locale={locale}
              showFullHours
              heading={
                <h2 className="text-h2 font-bold md:text-[1.625rem] md:tracking-[-0.03em] xl:text-h2-lg">
                  {dict.contactPage.storesHeading}
                </h2>
              }
            />
          </section>
        </Container>

        <Container className="pt-6 md:pt-10 xl:pt-16">
          <WholesaleCtaCard locale={locale} />
        </Container>

        {/*
          "O nama" — folded in from the deleted About page. The id is the
          anchor the footer's "O nama" link and the /o-nama redirect target.
        */}
        <Container id="o-nama" className="scroll-mt-20 pt-6 md:scroll-mt-32 md:pt-11 xl:pt-16">
          <h2 className="mb-3 text-h2 font-bold md:mb-5 md:text-[1.625rem] md:tracking-[-0.03em] xl:mb-8 xl:text-h2-lg">
            {dict.contactPage.aboutHeading}
          </h2>

          {/*
            Tablet inverts the order: body copy first, stat strip after. On a
            single narrow column the three tiles read as a caption to the prose
            rather than a header the reader has to get past — and in landscape
            the intrinsic 300px track puts them side by side anyway. `order`
            keeps this to one DOM node per block.
          */}
          <div className="md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:items-start md:gap-6">
            <div className="grid grid-cols-3 gap-2.5 md:order-2 md:gap-3 xl:order-none xl:max-w-2xl xl:gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-button bg-surface px-2.5 py-3.5 text-center shadow-card md:rounded-[18px] md:bg-fill md:p-[18px] md:text-left md:shadow-none xl:py-6 xl:text-center"
                >
                  <p className="text-2xl font-bold tracking-[-0.03em] md:text-[1.625rem] xl:text-[2rem]">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] leading-[1.3] text-muted md:mt-[3px] md:text-[0.875rem] xl:text-[0.9375rem]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3.5 flex max-w-3xl flex-col gap-2.5 md:order-1 md:mt-0 md:gap-3.5 xl:order-none xl:mt-8">
              {dict.contactPage.aboutParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-[1.5] text-muted md:text-[1.03125rem] md:leading-[1.6] xl:text-[1.0625rem] xl:leading-[1.5]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>

        <Container className="pb-6 pt-6 md:pb-14 md:pt-8 xl:pb-16">
          <div className="flex items-start gap-3 rounded-button bg-surface px-4 py-3.5 text-[1.03125rem] tracking-[-0.015em] shadow-card md:rounded-[18px] md:bg-fill md:p-[18px] md:shadow-none xl:max-w-2xl">
            <MapPin
              className="mt-0.5 size-[19px] shrink-0 text-teal-ink"
              strokeWidth={1.9}
              aria-hidden="true"
            />
            <span className="flex-1">
              {format(dict.contactPage.hqTemplate, { address: HQ_ADDRESS })}
            </span>
          </div>
        </Container>
      </main>

      <Footer locale={locale} />
    </>
  );
}
