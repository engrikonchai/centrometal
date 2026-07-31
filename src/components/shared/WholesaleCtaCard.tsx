import { Truck } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { inquiryPath } from "@/lib/paths";
import { Button } from "../ui/Button";

/**
 * The dark gradient wholesale CTA card.
 *
 * CLIENT REVIEW: both the "ponuda u roku od 24h" promise in the body and the
 * "Dostava po cijeloj Crnoj Gori" delivery claim are invented prototype copy
 * from the handoff's "Known placeholders" list.
 */
export function WholesaleCtaCard({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const dict = getDictionary(locale);

  return (
    <div
      className={clsx(
        "gradient-dark flex h-full flex-col justify-center rounded-hero p-5 text-white shadow-lifted md:rounded-[26px] md:p-8 xl:p-10",
        className,
      )}
    >
      <p className="text-h2 font-bold leading-[1.15] md:text-[1.6875rem] md:leading-[1.18] md:tracking-[-0.028em] xl:text-h2-lg">
        {dict.home.wholesaleHeading}
      </p>
      <p className="mt-2 text-[0.9375rem] leading-[1.45] text-white/[0.66] md:mt-3 md:text-[1.03125rem] md:leading-[1.5] md:text-white/[0.68] xl:text-base">
        {dict.home.wholesaleBody}
      </p>
      <p className="mt-3 flex items-center gap-2.5 text-[0.90625rem] text-white/80 md:text-[0.96875rem]">
        <Truck className="size-[17px] shrink-0 text-teal-on-dark" strokeWidth={2} aria-hidden="true" />
        {dict.home.wholesaleDelivery}
      </p>
      <Button
        href={inquiryPath(locale, "veleprodaja")}
        variant="onDark"
        size="lg"
        block
        className="mt-4 md:mt-[22px] md:min-h-[52px] md:w-fit md:px-[26px] xl:w-auto xl:px-8"
      >
        {dict.home.wholesaleCta}
      </Button>
    </div>
  );
}
