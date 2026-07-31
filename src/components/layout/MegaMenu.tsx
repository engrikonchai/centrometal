import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { categoryPath, subcategoryPath } from "@/lib/paths";

export function MegaMenu({
  locale,
  id,
  onNavigate,
}: {
  locale: Locale;
  id: string;
  onNavigate?: () => void;
}) {
  const dict = getDictionary(locale);

  return (
    <div id={id} className="border-t border-line bg-surface py-8 shadow-card">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-x-8 gap-y-8 px-4 xl:grid-cols-4 xl:px-8">
        {categories.map((category) => {
          const Icon = category.icon;
          const deptHref = categoryPath(locale, category.slug[locale]);
          return (
            <div key={category.slug.mne} className="min-w-0">
              <Link
                href={deptHref}
                onClick={onNavigate}
                className="group flex items-center gap-2 border-b border-line pb-2"
              >
                <Icon className="size-4 shrink-0 text-teal-ink" strokeWidth={2} aria-hidden="true" />
                <span className="truncate text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink transition group-hover:text-teal-ink">
                  {category.name[locale]}
                </span>
              </Link>
              <ul className="mt-2 space-y-0.5">
                {category.subcategories.map((sub) => (
                  <li key={sub.slug.mne}>
                    <Link
                      href={subcategoryPath(locale, category.slug[locale], sub.slug[locale])}
                      onClick={onNavigate}
                      className="block truncate rounded px-1 py-1 text-sm text-muted transition hover:text-ink"
                    >
                      {sub.name[locale]}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={deptHref}
                    onClick={onNavigate}
                    className="block px-1 py-1 text-sm font-semibold text-teal-ink transition hover:text-teal-hover"
                  >
                    {dict.nav.viewAll} →
                  </Link>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
