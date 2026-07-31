import { Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { homePath, inquiryPath, type InquiryType } from "@/lib/paths";
import { otherLocale } from "@/lib/i18n";
import { SALES_PHONE, telHref } from "@/lib/contact";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { Container } from "../ui/Container";
import { InquiryForm } from "./InquiryForm";

/**
 * /upit (/en/inquiry) — the site's single conversion path.
 * Mobile is a full-width column; tablet centres the form at 760px and desktop
 * at 900px. 760px is deliberate rather than a split-the-difference: a form
 * field much wider than that is harder to scan, so the tablet column stays
 * narrower than its container allows.
 *
 * The route is dynamic rather than static because it resolves ?type= on the
 * server. That's the right trade for a form: the alternative (reading the
 * param client-side with useSearchParams) kept the route static but excluded
 * the whole form from the prerender and made the Veleprodaja/Servis deep
 * links flash the wrong tab on load.
 */
export function InquiryPage({
  locale,
  initialType,
}: {
  locale: Locale;
  initialType: InquiryType;
}) {
  const dict = getDictionary(locale);

  return (
    <>
      <Header
        locale={locale}
        alternateHref={inquiryPath(otherLocale(locale))}
        mobile={{
          title: dict.inquiry.title,
          backHref: homePath(locale),
          actions: (
            <a
              href={telHref(SALES_PHONE)}
              aria-label={dict.nav.call}
              className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[rgba(60,60,67,0.06)] text-ink transition hover:bg-[rgba(60,60,67,0.1)]"
            >
              <Phone className="size-[18px]" strokeWidth={2} aria-hidden="true" />
            </a>
          ),
        }}
        /* Slimmed bar: no search field and no chip rail. This screen is the
           end of the funnel, so the header stops offering ways to leave it. */
        tablet={{ hideSearch: true, rail: "none" }}
      />

      <main className="flex-1">
        <Container className="px-0 md:px-6 md:pb-16 md:pt-10 xl:px-8">
          <h1 className="hidden text-[2.125rem] font-bold tracking-[-0.032em] md:mx-auto md:block md:max-w-[760px] xl:max-w-[900px] xl:text-[2.5rem] xl:tracking-[-0.03em]">
            {dict.inquiry.title}
          </h1>
          <InquiryForm locale={locale} initialType={initialType} />
        </Container>
      </main>

      <Footer locale={locale} />
    </>
  );
}
