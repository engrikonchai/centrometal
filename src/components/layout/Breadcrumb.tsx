import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { homePath } from "@/lib/paths";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * The last item is treated as the current page (no link, aria-current). Items
 * in between render as links only if an href is given, otherwise as plain text
 * (e.g. a "Products" crumb with no index page yet).
 *
 * `showHome` prepends a Home crumb. The redesigned category and product pages
 * pass `false` because their design references start at "Proizvodi"; the pages
 * still on the old PageHeader keep it, since there it's the only way back.
 */
export function Breadcrumb({
  locale,
  items,
  showHome = true,
}: {
  locale: Locale;
  items: BreadcrumbItem[];
  showHome?: boolean;
}) {
  const dict = getDictionary(locale);
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: dict.breadcrumb.home, href: homePath(locale) }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className="text-[0.90625rem] text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {allItems.map((item, i) => {
          const isLast = i === allItems.length - 1;
          return (
            <li
              key={item.label}
              className={i > 0 ? "flex items-center gap-2" : undefined}
              aria-current={isLast ? "page" : undefined}
            >
              {/* Design uses a plain "/" separator rather than a chevron. */}
              {i > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-teal-ink">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-ink" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
