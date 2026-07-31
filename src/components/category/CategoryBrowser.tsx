"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Package, Search, SlidersHorizontal } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import { format, getDictionary, pluralize } from "@/lib/dictionary";
import { getCategoryBySlug } from "@/lib/taxonomy";
import type { Product } from "@/lib/products";
import { brands as allBrands, getBrandBySlug } from "@/lib/brands";
import { inquiryPath } from "@/lib/paths";
import { SALES_PHONE, telHref } from "@/lib/contact";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { ProductCard } from "../product/ProductCard";
import { Button } from "../ui/Button";

/** `?sub=a,b` / `?brand=a,b`; a bare single value still works (mega-menu deep links). */
function parseList(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function CategoryBrowser({
  locale,
  categorySlug,
  products,
}: {
  locale: Locale;
  categorySlug: string;
  products: Product[];
}) {
  const dict = getDictionary(locale);
  const category = getCategoryBySlug("mne", categorySlug)!;

  /*
    Filter state is deliberately NOT read via useSearchParams.

    Calling that hook inside the <Suspense> boundary this component sits in
    makes Next exclude the whole subtree from the prerender — the static HTML
    for a category page contained zero product cards, so the grid existed only
    after hydration. For an SEO-driven catalogue where the grid *is* the page,
    that's the wrong trade.

    Instead: state starts empty (matching what the server renders, so
    hydration is clean), an effect adopts any filters from the URL on mount,
    and every change is written back with history.replaceState. The grid is
    server-rendered and filtered views stay shareable and bookmarkable. The
    cost is one frame of unfiltered content on a deep-linked ?sub= URL.
  */
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  useEffect(() => {
    // Deferred rather than called synchronously in the effect body to satisfy
    // react-hooks/set-state-in-effect — same pattern CartContext uses for its
    // localStorage hydration.
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      // The `sub` param may carry either locale's slug (mega-menu and drawer
      // links use the localized one); resolve to the MNE slug used internally.
      const rawSubs = parseList(params.get("sub"));
      const subs = category.subcategories
        .filter((sub) => rawSubs.includes(sub.slug.mne) || rawSubs.includes(sub.slug.en))
        .map((sub) => sub.slug.mne);
      if (subs.length > 0) setSelectedSubcategories(subs);

      const brandsFromUrl = parseList(params.get("brand"));
      if (brandsFromUrl.length > 0) setSelectedBrands(brandsFromUrl);
    });
  }, [category]);

  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  useBodyScrollLock(sheetOpen);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSheetOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* The sheet is a mobile-only pattern — from 768px the filters live in the
     persistent rail. Closing it when the viewport crosses that line keeps a
     rotation or Split View resize from stranding the body scroll lock behind a
     sheet that is no longer displayed. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    function sync(event: MediaQueryListEvent | MediaQueryList) {
      if (event.matches) setSheetOpen(false);
    }
    sync(mq);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* The sheet claims aria-modal, so focus has to actually move into it on
     open and return to the trigger on close. `wasOpen` keeps the restore from
     firing on mount, which would otherwise steal focus on page load. */
  const wasOpen = useRef(false);
  useEffect(() => {
    if (sheetOpen) sheetRef.current?.focus();
    else if (wasOpen.current) filterTriggerRef.current?.focus({ preventScroll: true });
    wasOpen.current = sheetOpen;
  }, [sheetOpen]);

  /*
    Mirrors the current selection into the URL without going through the Next
    router: replaceState updates the address bar in place, so there's no
    navigation, no server round-trip and no new history entry per checkbox
    click. Next supports native history calls for exactly this case.
  */
  const syncUrl = useCallback((key: "sub" | "brand", values: string[]) => {
    const params = new URLSearchParams(window.location.search);
    if (values.length > 0) params.set(key, values.join(","));
    else params.delete(key);
    const queryString = params.toString();
    window.history.replaceState(
      null,
      "",
      queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname,
    );
  }, []);

  const toggleSubcategory = useCallback(
    (slug: string) => {
      setSelectedSubcategories((prev) => {
        const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
        syncUrl("sub", next);
        return next;
      });
    },
    [syncUrl],
  );

  const toggleBrand = useCallback(
    (slug: string) => {
      setSelectedBrands((prev) => {
        const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
        syncUrl("brand", next);
        return next;
      });
    },
    [syncUrl],
  );

  function clearFilters() {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    syncUrl("sub", []);
    syncUrl("brand", []);
  }

  const brandsInCategory = useMemo(() => {
    const slugsInCategory = new Set(products.map((p) => p.brandSlug));
    return allBrands.filter((b) => slugsInCategory.has(b.slug));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const subcategoryMatch =
        selectedSubcategories.length === 0 ||
        selectedSubcategories.includes(product.subcategorySlug);
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(product.brandSlug);
      const queryMatch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (getBrandBySlug(product.brandSlug)?.name.toLowerCase().includes(q) ?? false);
      return subcategoryMatch && brandMatch && queryMatch;
    });
  }, [products, selectedSubcategories, selectedBrands, query]);

  const activeCount = selectedSubcategories.length + selectedBrands.length;
  const countLabel = pluralize(
    filteredProducts.length,
    dict.category.countOne,
    dict.category.countManyTemplate,
  );
  const applyLabel = pluralize(
    filteredProducts.length,
    dict.category.applyOne,
    dict.category.applyManyTemplate,
  );

  const checklistRow =
    "flex w-full items-center justify-between gap-2.5 px-4 py-2 text-left text-[1.03125rem] tracking-[-0.015em] text-ink min-h-12";

  const filterGroups = [
    {
      key: "sub" as const,
      label: dict.category.subcategoryLabel,
      rows: category.subcategories.map((sub) => ({
        key: sub.slug.mne,
        label: sub.name[locale],
        checked: selectedSubcategories.includes(sub.slug.mne),
        toggle: () => toggleSubcategory(sub.slug.mne),
      })),
    },
    {
      key: "brand" as const,
      label: dict.category.brandLabel,
      rows: brandsInCategory.map((brand) => ({
        key: brand.slug,
        label: brand.name,
        checked: selectedBrands.includes(brand.slug),
        toggle: () => toggleBrand(brand.slug),
      })),
    },
  ];

  return (
    /*
      No `items-start` here — Chromium breaks `position: sticky` on a
      descendant that isn't itself a direct grid item (e.g. the sticky div
      inside <aside>) when the grid container sets `align-items` to anything
      but its `stretch` default: the sticky element stops clamping to `top`
      and just scrolls with the page. Default `stretch` sizes <aside> to the
      row height instead, which is exactly what a sticky rail wants anyway —
      confirmed against the desktop column, which always used the default and
      never needed items-start.
    */
    <div className="md:grid md:grid-cols-[236px_minmax(0,1fr)] md:gap-6 xl:grid-cols-[260px_1fr] xl:gap-10">
      {/*
        Tablet and desktop: sticky filter sidebar, which replaces the mobile
        bottom sheet entirely from 768px up — at this width there is room to
        show filters and results at the same time, so hiding the filters behind
        a modal would be a step backwards.

        Tablet draws it as a #f4f5f6 rounded card with 44px rows and 20px
        checkboxes; desktop keeps the borderless 38px/16px treatment, which is
        fine for a mouse. Rows are custom checkbox squares rather than native
        inputs, per the design. The native input is still there — visually
        hidden but focusable and announced — and the square mirrors its state,
        so keyboard and screen-reader use is unchanged. `peer-focus-visible`
        puts the focus ring on the square, which would otherwise be invisible.

        The sticky offset clears each breakpoint's own header: 118px for the
        tablet's two-row bar, 96px for the desktop's single row.
      */}
      <aside className="hidden md:block">
        <div className="sticky top-[118px] flex flex-col gap-5 rounded-[22px] bg-fill px-3.5 py-[18px] xl:top-[96px] xl:gap-6 xl:rounded-none xl:bg-transparent xl:p-0">
          {filterGroups.map((group, groupIndex) => (
            <div key={group.key}>
              {/* The design puts "Obriši" inline with the first group's label. */}
              {groupIndex > 0 && <div className="mb-5 h-px bg-navy/[0.09] xl:mb-6" />}
              <div className="flex items-center justify-between gap-3 px-1.5 xl:px-0">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-muted">
                  {group.label}
                </p>
                {groupIndex === 0 && activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="-mr-1.5 px-1.5 py-1.5 text-[0.84375rem] font-semibold text-teal-ink transition hover:text-teal-hover xl:mr-0 xl:p-0 xl:text-[0.8125rem]"
                  >
                    {dict.category.clear}
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-col gap-0.5 xl:mt-2.5 xl:gap-1">
                {group.rows.map((row) => (
                  <label
                    key={row.key}
                    className={clsx(
                      "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl px-2.5 text-[0.9375rem] font-medium leading-[1.25] text-navy transition xl:min-h-0 xl:h-[38px] xl:rounded-[10px] xl:text-[0.90625rem]",
                      row.checked ? "bg-teal/[0.1] xl:bg-teal/[0.08]" : "hover:bg-navy/[0.04]",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={row.checked}
                      onChange={row.toggle}
                    />
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "grid size-5 shrink-0 place-items-center rounded-md border-[1.5px] transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal xl:size-4 xl:rounded-[5px]",
                        row.checked ? "border-teal bg-teal text-white" : "border-navy/25",
                      )}
                    >
                      {row.checked && (
                        <Check className="size-3 xl:size-2.5" strokeWidth={3.4} aria-hidden="true" />
                      )}
                    </span>
                    {row.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Mobile: in-page search. Tablet scopes the header search field to
            this category instead, so this would be a second search box. */}
        <div className="px-4 md:hidden">
          <div className="flex h-10 items-center gap-2 rounded-xl bg-[rgba(118,118,128,0.12)] px-2.5">
            <Search className="size-[17px] shrink-0 text-muted" strokeWidth={2.2} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.category.searchPlaceholder}
              aria-label={dict.category.searchPlaceholder}
              className="min-w-0 flex-1 border-0 bg-transparent text-[1.0625rem] tracking-[-0.01em] text-ink placeholder:text-muted"
            />
          </div>
          <p className="mt-3 text-[0.9375rem] leading-[1.45] text-muted">
            {category.intro[locale]}
          </p>
        </div>

        {/* Mobile: subcategory chips — the filter rail carries these from
            768px up. */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 py-0.5 md:hidden">
          {category.subcategories.map((sub) => {
            const active = selectedSubcategories.includes(sub.slug.mne);
            return (
              <button
                key={sub.slug.mne}
                type="button"
                aria-pressed={active}
                onClick={() => toggleSubcategory(sub.slug.mne)}
                className={clsx(
                  "h-[34px] shrink-0 whitespace-nowrap rounded-full px-3.5 text-[0.90625rem] font-medium tracking-[-0.01em] transition",
                  active ? "bg-teal text-white" : "bg-surface text-ink shadow-card",
                )}
              >
                {sub.name[locale]}
              </button>
            );
          })}
        </div>

        {/* Mobile: sticky result count + filter trigger. From 768px the count
            is plain static text — the filters are already on screen. */}
        <div className="sticky top-[60px] z-20 mt-3 flex items-center justify-between gap-3 bg-warehouse/[0.88] px-4 py-2 backdrop-blur-xl backdrop-saturate-[1.8] md:static md:mt-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <p className="text-[0.9375rem] text-muted md:mb-3.5 md:text-[0.96875rem]">{countLabel}</p>
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            className="flex h-8 items-center gap-1.5 rounded-full bg-teal/10 px-3 text-[0.90625rem] font-semibold tracking-[-0.01em] text-teal-ink md:hidden"
          >
            <SlidersHorizontal className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
            {activeCount > 0
              ? format(dict.category.filtersActiveTemplate, { count: activeCount })
              : dict.category.filtersButton}
          </button>
        </div>

        {filteredProducts.length > 0 ? (
          <div
            data-testid="category-grid"
            /* Tablet uses the handoff's intrinsic track instead of a column
               count: 210px minimum resolves to 2-up in portrait and 3-up in
               landscape on its own, so no orientation branch is needed. */
            className="grid grid-cols-2 gap-3 px-4 pb-6 pt-1 md:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] md:gap-3.5 md:px-0 md:pb-0 md:pt-0 xl:grid-cols-4 xl:gap-5 xl:pt-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={`${product.categorySlug}/${product.slug}`}
                product={product}
                locale={locale}
                showSubcategory
              />
            ))}
          </div>
        ) : (
          <div className="mx-4 mb-6 flex flex-col items-center gap-3 rounded-card bg-surface px-6 py-[34px] text-center shadow-card md:mx-0 md:mb-0 md:gap-3.5 md:rounded-[22px] md:bg-fill md:px-6 md:py-14 md:shadow-none xl:mt-6">
            <Package className="size-[34px] text-muted/60" strokeWidth={1.6} aria-hidden="true" />
            <p className="max-w-[400px] text-base leading-[1.45] md:text-[1.03125rem]">
              {dict.category.emptyBody}
            </p>
            <Button href={telHref(SALES_PHONE)} variant="primary" block className="md:w-auto">
              {format(dict.category.callTemplate, { phone: SALES_PHONE })}
            </Button>
          </div>
        )}

        {/*
          "Ne vidite što tražite?" dark CTA. Tablet uses flex-wrap rather than a
          breakpoint-keyed row/column switch, so the button drops below the text
          on its own once the content column gets narrow (portrait) and sits
          beside it when there's room (landscape).
        */}
        <div className="gradient-dark mx-4 mb-6 rounded-hero p-[18px] text-white shadow-lifted md:mx-0 md:mt-7 md:flex md:flex-wrap md:items-center md:justify-between md:gap-5 md:rounded-3xl md:p-7 xl:mt-0 xl:flex-nowrap xl:gap-8 xl:rounded-hero xl:p-8">
          <div className="md:min-w-[240px] md:flex-1">
            <p className="text-[1.1875rem] font-bold leading-[1.2] tracking-[-0.025em] md:text-[1.3125rem] xl:text-[1.5rem]">
              {dict.category.ctaHeading}
            </p>
            <p className="mt-1.5 text-[0.9375rem] text-white/[0.66] md:text-[0.96875rem]">
              {dict.category.ctaBody}
            </p>
          </div>
          <Button
            href={inquiryPath(locale)}
            variant="onDark"
            block
            className="mt-3.5 md:mt-0 md:w-auto md:shrink-0 md:px-6 xl:px-8"
          >
            {dict.category.ctaButton}
          </Button>
        </div>
      </div>

      {/*
        Mobile filter bottom sheet. Never renders from 768px up: the trigger is
        hidden there and `sheetOpen` is forced false on the breakpoint change,
        so rotating an iPad while the sheet is open can't leave an invisible
        modal holding the body scroll lock.
      */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={dict.category.sheetHeading}>
          <div
            className="absolute inset-0 bg-[rgba(11,16,21,0.4)]"
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={sheetRef}
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-hero bg-warehouse shadow-[0_-8px_30px_rgba(11,16,21,0.25)] focus:outline-none"
          >
            <div className="sticky top-0 bg-warehouse/[0.92] px-4 pb-2.5 pt-2 backdrop-blur-xl">
              <div className="mx-auto mb-2.5 h-[5px] w-[38px] rounded-full bg-muted/40" />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-base text-teal-ink transition hover:text-teal-hover"
                >
                  {dict.category.clear}
                </button>
                <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
                  {dict.category.sheetHeading}
                </span>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="text-base font-semibold text-teal-ink transition hover:text-teal-hover"
                >
                  {dict.category.done}
                </button>
              </div>
            </div>

            <div className="px-4 pb-4 pt-1">
              {filterGroups.map((group) => (
                <div key={group.key}>
                  <p className="mb-2 mt-2 px-4 text-[0.8125rem] font-medium uppercase tracking-[0.02em] text-muted">
                    {group.label}
                  </p>
                  <div className="divide-hairline overflow-hidden rounded-button bg-surface">
                    {group.rows.map((row) => (
                      <button
                        key={row.key}
                        type="button"
                        aria-pressed={row.checked}
                        onClick={row.toggle}
                        className={checklistRow}
                      >
                        {row.label}
                        {row.checked && (
                          <Check
                            className="size-[17px] shrink-0 text-teal-ink"
                            strokeWidth={2.6}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={() => setSheetOpen(false)}
                variant="primary"
                size="lg"
                block
                className="mt-6"
              >
                {applyLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
