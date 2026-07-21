import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";

export function MegaMenu({
  locale,
  id,
  onNavigate,
}: {
  locale: Locale;
  id: string;
  onNavigate?: () => void;
}) {
  return (
    <div
      id={id}
      className="border-t border-steel bg-navy py-8 shadow-lg"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-8 gap-y-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug.mne}
              href={categoryPath(locale, category.slug[locale])}
              onClick={onNavigate}
              className="group flex items-start gap-3 rounded-button p-2 transition hover:bg-steel"
            >
              <Icon
                className="mt-0.5 size-5 shrink-0 text-teal"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-white group-hover:text-white">
                {category.name[locale]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
