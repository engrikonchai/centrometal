import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { clsx } from "clsx";

function LocaleLink({
  isActive,
  href,
  touch,
  children,
}: {
  isActive: boolean;
  href: string;
  touch?: boolean;
  children: React.ReactNode;
}) {
  /* The default is a compact inline pair sized for a mouse. `touch` grows each
     locale into its own 44px target for the tablet header, where this is the
     only language control on screen (the drawer that carries it on mobile is
     suppressed in the 768-1279 band). */
  const shape = touch
    ? "grid min-h-11 min-w-9 place-items-center px-1"
    : "px-1.5 py-0.5";

  if (isActive) {
    return (
      <span aria-current="page" className={clsx(shape, "text-teal-ink")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={clsx(shape, "text-muted transition hover:text-ink")}>
      {children}
    </Link>
  );
}

export function LanguageSwitch({
  locale,
  alternateHref,
  className,
  touch = false,
}: {
  locale: Locale;
  alternateHref: string;
  className?: string;
  /** Grows each locale to a 44px tap target (tablet header). */
  touch?: boolean;
}) {
  return (
    <div className={clsx("flex items-center gap-1 text-label font-semibold", className)}>
      <LocaleLink isActive={locale === "mne"} href={alternateHref} touch={touch}>
        MNE
      </LocaleLink>
      <span className="text-muted/50" aria-hidden="true">
        /
      </span>
      <LocaleLink isActive={locale === "en"} href={alternateHref} touch={touch}>
        EN
      </LocaleLink>
    </div>
  );
}
