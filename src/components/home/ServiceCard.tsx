import { Check, Settings } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { inquiryPath } from "@/lib/paths";
import { SALES_PHONE, telHref } from "@/lib/contact";
import { Button } from "../ui/Button";

/**
 * "Sopstveni servis" card. The three bullets are prototype copy — see the
 * handoff's "Known placeholders" list; they need client confirmation.
 */
export function ServiceCard({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    /* Horizontal padding is owned by the parent Container. */
    <section className="pb-[22px] xl:pb-0">
      <div className="rounded-hero bg-surface p-[18px] shadow-card xl:bg-fill xl:p-8 xl:shadow-none">
        <div className="flex items-center gap-2.5">
          <span className="grid size-[34px] place-items-center rounded-full bg-teal/[0.12]">
            <Settings className="size-[18px] text-teal-ink" strokeWidth={2} aria-hidden="true" />
          </span>
          <h2 className="text-h2 font-bold xl:text-h2-lg">{dict.home.serviceHeading}</h2>
        </div>

        <p className="mt-2.5 text-[0.9375rem] leading-[1.45] text-muted">{dict.home.serviceBody}</p>

        <ul className="mt-3.5 flex flex-col gap-2.5">
          {dict.home.serviceBullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2.5 text-[0.9375rem] tracking-[-0.01em]">
              <Check className="size-[17px] shrink-0 text-green" strokeWidth={2.4} aria-hidden="true" />
              {bullet}
            </li>
          ))}
        </ul>

        <div className="mt-4 grid grid-cols-2 gap-2.5 xl:max-w-md">
          <Button href={inquiryPath(locale, "servis")} variant="primary">
            {dict.home.serviceCtaPrimary}
          </Button>
          <Button href={telHref(SALES_PHONE)} variant="secondary">
            {dict.home.serviceCtaSecondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
