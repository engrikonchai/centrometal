import { Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import type { Product } from "@/lib/products";
import { SALES_PHONE, telHref } from "@/lib/contact";
import { AddToInquiryButton } from "./AddToInquiryButton";

/**
 * Mobile-only sticky action bar: outlined "Pozovite" beside the filled
 * "Dodaj u upit". Tablet and desktop put the same pair inline in the detail
 * column — at 768px and up the CTA is already above the fold, so the bar would
 * only cost vertical space and duplicate a visible control.
 */
export function ProductStickyBar({ product, locale }: { product: Product; locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <div className="sticky bottom-0 z-30 grid grid-cols-[1fr_1.4fr] gap-2.5 border-t-[0.5px] border-muted/30 bg-[rgba(249,249,251,0.88)] px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl backdrop-saturate-[1.8] md:hidden">
      <a
        href={telHref(SALES_PHONE)}
        className="flex h-12 items-center justify-center gap-[7px] rounded-full bg-teal/10 text-[0.96875rem] font-semibold tracking-[-0.015em] text-teal-ink transition hover:bg-teal/15"
      >
        <Phone className="size-[17px]" strokeWidth={2} aria-hidden="true" />
        {dict.nav.call}
      </a>
      <AddToInquiryButton product={product} locale={locale} />
    </div>
  );
}
