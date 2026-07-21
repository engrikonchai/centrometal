import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { homePath } from "@/lib/paths";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Home is prepended automatically. The last item is treated as the current
 * page (no link, aria-current). Items in between render as links only if
 * an href is given, otherwise as plain text (e.g. a "Products" crumb with
 * no index page yet).
 */
export function Breadcrumb({
  locale,
  items,
}: {
  locale: Locale;
  items: BreadcrumbItem[];
}) {
  const dict = getDictionary(locale);
  const allItems: BreadcrumbItem[] = [
    { label: dict.breadcrumb.home, href: homePath(locale) },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {allItems.map((item, i) => {
          const isLast = i === allItems.length - 1;
          return (
            <li
              key={item.label}
              className={i > 0 ? "flex items-center gap-1.5" : undefined}
              aria-current={isLast ? "page" : undefined}
            >
              {i > 0 && <ChevronRight className="size-3.5" strokeWidth={2} aria-hidden="true" />}
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-teal">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-navy" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
