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
 * Mobile is a full-width column; desktop centres the form at 900px.
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
      />

      <main className="flex-1">
        <Container className="px-0 lg:px-8 lg:pb-16 lg:pt-10">
          <h1 className="hidden text-[2.5rem] font-bold tracking-[-0.03em] lg:mx-auto lg:block lg:max-w-[900px]">
            {dict.inquiry.title}
          </h1>
          <InquiryForm locale={locale} initialType={initialType} />
        </Container>
      </main>

      <Footer locale={locale} />
    </>
  );
}
