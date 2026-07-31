"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";

/**
 * "Odjeljenja".
 *
 * Mobile: a collapsed-by-default accordion. The trigger carries its own tap
 * affordance — tinted pill, a count badge, and a filled circular chevron that
 * rotates — because a bare heading gave no signal the list could open.
 *
 * Tablet and desktop: the icon-card grid, always visible. The accordion is a
 * mobile-only device for keeping the eight departments from pushing the rest
 * of the home screen below the fold — at 768px and up the grid fits without
 * doing that, so there is nothing for it to solve.
 */
export function DepartmentsSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    /* Horizontal padding is owned by the parent Container. */
    <section className="pb-[22px] md:pb-0">
      {/*
        Mobile: accordion trigger. The heading *wraps* the button rather than
        sitting inside it — an <h2> nested in a <button> is skipped by the
        accessible-name computation (the control ends up nameless) and the
        heading drops out of the document outline entirely. This is the
        standard disclosure pattern and keeps both.
      */}
      <h2 className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={panelId}
          className={clsx(
            "flex w-full items-center gap-3 rounded-button bg-teal/[0.08] px-3.5 py-3 text-left transition",
            open ? "bg-teal/[0.12]" : "hover:bg-teal/[0.12]",
          )}
        >
          <span className="text-h2 font-bold">{dict.home.departmentsHeading}</span>
          {/* Not aria-hidden: the count is real information, and it reads as
              part of the control's name ("Odjeljenja 8"). */}
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-teal/[0.16] px-1.5 text-[0.8125rem] font-bold text-teal-ink">
            {categories.length}
          </span>
          <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-teal text-white">
            <ChevronDown
              className={clsx("size-[18px] transition-transform duration-200", open && "rotate-180")}
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </span>
        </button>
      </h2>

      {/* Tablet + desktop heading and "Sva odjeljenja" link. */}
      <div className="hidden items-baseline justify-between gap-3 md:flex">
        <h2 className="text-h2 font-bold md:text-[1.75rem] md:tracking-[-0.03em] xl:text-h2-lg">
          {dict.home.departmentsHeading}
        </h2>
        <Link
          href={categoryPath(locale, categories[0].slug[locale])}
          className="flex min-h-11 items-center whitespace-nowrap text-[0.9375rem] font-medium text-teal-ink transition hover:text-teal-hover md:text-base md:font-semibold xl:min-h-0 xl:font-medium"
        >
          {dict.nav.allDepartments} →
        </Link>
      </div>

      {/* Mobile: collapsible inset card, hairline-divided rows. */}
      <div
        id={panelId}
        /* `hidden` rather than a height transition: the collapsed list must be
           out of the tab order and the accessibility tree, not merely clipped. */
        hidden={!open}
        className="divide-hairline mt-2 overflow-hidden rounded-button bg-surface shadow-card md:hidden"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug.mne}
              href={categoryPath(locale, category.slug[locale])}
              className="flex min-h-[54px] items-center gap-3 px-3.5 py-2 text-[1.03125rem] tracking-[-0.015em] text-ink"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-teal/[0.12]">
                <Icon className="size-[18px] text-teal-ink" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="flex-1">{category.name[locale]}</span>
              <ChevronRight className="size-4 shrink-0 text-muted/60" strokeWidth={2} aria-hidden="true" />
            </Link>
          );
        })}
      </div>

      {/*
        Tablet + desktop: icon cards, always visible. Tablet uses the handoff's
        intrinsic 180px track, which resolves to 4-up in portrait and 6-up in
        landscape on its own; desktop keeps its fixed 4-column grid. The label
        is bottom-anchored (`mt-auto`) against a 128px minimum so two-line
        department names don't shift the icons out of alignment.
      */}
      <div className="mt-[18px] hidden grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 md:grid xl:mt-8 xl:grid-cols-4 xl:gap-5">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug.mne}
              href={categoryPath(locale, category.slug[locale])}
              className="flex min-h-32 flex-col gap-4 rounded-[20px] bg-fill p-[18px] transition hover:bg-[#eeeff1] xl:min-h-0 xl:rounded-card xl:p-6"
            >
              <span className="grid size-11 place-items-center rounded-[13px] bg-teal/[0.12] xl:size-12 xl:rounded-full">
                <Icon className="size-[21px] text-teal-ink xl:size-[22px]" strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="mt-auto text-[1.03125rem] font-semibold leading-[1.25] tracking-[-0.015em] text-ink xl:mt-0 xl:text-[1.0625rem] xl:tracking-[-0.02em]">
                {category.name[locale]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
