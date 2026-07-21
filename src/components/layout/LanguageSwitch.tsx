import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { clsx } from "clsx";

function LocaleLink({
  isActive,
  href,
  children,
}: {
  isActive: boolean;
  href: string;
  children: React.ReactNode;
}) {
  if (isActive) {
    return (
      <span aria-current="page" className="px-1.5 py-0.5 text-teal-on-dark">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className="px-1.5 py-0.5 text-white/70 transition hover:text-white">
      {children}
    </Link>
  );
}

export function LanguageSwitch({
  locale,
  alternateHref,
  className,
}: {
  locale: Locale;
  alternateHref: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-1 text-label font-semibold", className)}>
      <LocaleLink isActive={locale === "mne"} href={alternateHref}>
        MNE
      </LocaleLink>
      <span className="text-white/40" aria-hidden="true">
        /
      </span>
      <LocaleLink isActive={locale === "en"} href={alternateHref}>
        EN
      </LocaleLink>
    </div>
  );
}
