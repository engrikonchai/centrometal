"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { stores, storeDirectionsUrl, storeMapEmbedUrl } from "@/lib/locations";
import { telHref } from "@/lib/contact";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Button } from "../ui/Button";

/**
 * Store locator: a segmented toggle over a *single* embedded map, replacing
 * the old two-stacked-maps treatment. Shared by the home screen and the
 * contact page.
 *
 * `showFullHours` switches between the home screen's one-line hours summary
 * and the contact page's three-row table (which is the only place Sunday
 * hours appear — they were missing from the original site entirely).
 */
export function StoresSection({
  locale,
  showFullHours = false,
  className,
}: {
  locale: Locale;
  showFullHours?: boolean;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const [index, setIndex] = useState(0);
  const store = stores[index];

  const hourRows = [
    { label: dict.contactPage.hoursWeekdays, value: dict.contactPage.hoursWeekdaysValue },
    { label: dict.contactPage.hoursSaturday, value: dict.contactPage.hoursSaturdayValue },
    { label: dict.contactPage.hoursSunday, value: dict.contactPage.hoursSundayValue },
  ];

  return (
    <div className={className}>
      <SegmentedControl
        label={dict.home.storeToggleLabel}
        value={String(index)}
        onChange={(value) => setIndex(Number(value))}
        segments={stores.map((item, i) => ({ value: String(i), label: item.shortName }))}
        className="lg:max-w-sm"
      />

      <div className="mt-3 overflow-hidden rounded-card bg-surface shadow-card lg:bg-fill lg:shadow-none">
        <div className="h-[156px] bg-[#e5e7ea] lg:h-[340px]">
          <iframe
            /* Re-keyed per store so switching swaps the map rather than
               leaving a stale frame behind. */
            key={store.address}
            src={storeMapEmbedUrl(store)}
            title={`${dict.contactPage.storesHeading} — ${store.name}`}
            className="block h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="px-4 pb-4 pt-3.5">
          <p className="text-[1.0625rem] font-semibold tracking-[-0.02em]">{store.name}</p>
          <p className="mt-1 text-[0.9375rem] text-muted">{store.address}</p>

          {showFullHours ? (
            <dl className="mt-3 flex flex-col gap-[7px] border-t border-line pt-3">
              {hourRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[0.96875rem]">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-0.5 text-[0.9375rem] text-muted">
              {hourRows
                .slice(0, 2)
                .map((row) => `${row.label} ${row.value}`)
                .join(" · ")}
            </p>
          )}

          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
            <Button href={telHref(store.phone)} variant="primary">
              {dict.home.storeCall}
            </Button>
            <Button
              href={storeDirectionsUrl(store)}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dict.home.storeDirections}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
