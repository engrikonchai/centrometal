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
      />

      <main className="flex-1">
        <Container className="pt-3 lg:pt-10">
          <div className="hidden lg:block">
            <h1 className="text-[2.5rem] font-bold tracking-[-0.03em]">
              {dict.contactPage.heading}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted">{dict.contactPage.subtitle}</p>
          </div>

          {/* Quick actions. */}
          <div className="grid grid-cols-2 gap-2.5 lg:mt-8 lg:max-w-md">
            <a
              href={telHref(SALES_PHONE)}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-teal text-[0.96875rem] font-semibold tracking-[-0.015em] text-white transition hover:bg-teal-hover"
            >
              <Phone className="size-[17px]" strokeWidth={2} aria-hidden="true" />
              {dict.contactPage.callCta}
            </a>
            <a
              href={mailHref}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-teal/10 text-[0.96875rem] font-semibold tracking-[-0.015em] text-teal-ink transition hover:bg-teal/15"
            >
              <Mail className="size-[17px]" strokeWidth={2} aria-hidden="true" />
              {dict.contactPage.emailCta}
            </a>
          </div>
        </Container>

        {/* Contact details + stores: stacked on mobile, side by side on desktop. */}
        {/* Design splits this 1fr 2fr, giving the map the wider column. */}
        <Container className="pt-5 lg:grid lg:grid-cols-[1fr_2fr] lg:items-start lg:gap-12 lg:pt-14">
          <section>
            <h2 className="mb-2.5 text-h2 font-bold lg:text-h2-lg">
              {dict.contactPage.contactHeading}
            </h2>
            <div className="flex flex-col gap-2">
              {contactRows.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-button bg-surface px-4 py-3.5 text-[1.03125rem] tracking-[-0.015em] text-ink shadow-card transition hover:shadow-[0_4px_12px_rgba(17,21,26,0.1)] lg:bg-fill lg:shadow-none lg:hover:bg-[#eeeff1]"
                >
                  <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-teal/10">
                    <Icon className="size-[17px] text-teal-ink" strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <span className="flex-1">{label}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="pt-[22px] lg:pt-0">
            <h2 className="mb-3 text-h2 font-bold lg:text-h2-lg">
              {dict.contactPage.storesHeading}
            </h2>
            <StoresSection locale={locale} showFullHours />
          </section>
        </Container>

        <Container className="pt-6 lg:pt-16">
          <WholesaleCtaCard locale={locale} />
        </Container>

        {/*
          "O nama" — folded in from the deleted About page. The id is the
          anchor the footer's "O nama" link and the /o-nama redirect target.
        */}
        <Container id="o-nama" className="scroll-mt-20 pt-6 lg:pt-16">
          <h2 className="mb-3 text-h2 font-bold lg:mb-8 lg:text-h2-lg">
            {dict.contactPage.aboutHeading}
          </h2>

          <div className="grid grid-cols-3 gap-2.5 lg:max-w-2xl lg:gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-button bg-surface px-2.5 py-3.5 text-center shadow-card lg:bg-fill lg:py-6 lg:shadow-none"
              >
                <p className="text-2xl font-bold tracking-[-0.03em] lg:text-[2rem]">{stat.value}</p>
                <p className="mt-0.5 text-[0.8125rem] leading-[1.3] text-muted lg:text-[0.9375rem]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3.5 flex max-w-3xl flex-col gap-2.5 lg:mt-8">
            {dict.contactPage.aboutParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-[1.5] text-muted lg:text-[1.0625rem]">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>

        <Container className="pb-6 pt-6 lg:pb-16">
          <div className="flex items-start gap-3 rounded-button bg-surface px-4 py-3.5 text-[1.03125rem] tracking-[-0.015em] shadow-card lg:max-w-2xl lg:bg-fill lg:shadow-none">
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
