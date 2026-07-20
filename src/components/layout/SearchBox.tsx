"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { searchProducts } from "@/lib/data";
import type { Product } from "@/lib/products";
import { getBrandBySlug } from "@/lib/brands";
import { getCategoryBySlug } from "@/lib/taxonomy";
import { productPath, searchPath } from "@/lib/paths";
import { inputBase } from "../forms/fields";

const MAX_SUGGESTIONS = 8;
const MAX_QUERY_LENGTH = 100;
const DEBOUNCE_MS = 200;

function productHref(locale: Locale, product: Product): string {
  const categorySlug =
    getCategoryBySlug("mne", product.categorySlug)?.slug[locale] ?? product.categorySlug;
  return productPath(locale, categorySlug, product.slug);
}

export function SearchBox({
  locale,
  variant,
}: {
  locale: Locale;
  variant: "inline" | "collapsible";
}) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const listId = useId();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [expanded, setExpanded] = useState(variant === "inline");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    let cancelled = false;
    const timeout = setTimeout(() => {
      searchProducts(trimmed).then((found) => {
        if (cancelled) return;
        setResults(found.slice(0, MAX_SUGGESTIONS));
        setOpen(true);
        setActiveIndex(-1);
      });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        if (variant === "collapsible") setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [variant]);

  useEffect(() => {
    if (variant === "collapsible" && expanded) inputRef.current?.focus();
  }, [variant, expanded]);

  function reset() {
    setQuery("");
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function closeAndCollapse() {
    reset();
    if (variant === "collapsible") setExpanded(false);
  }

  function handleSuggestionClick() {
    inputRef.current?.blur();
    closeAndCollapse();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      if (variant === "collapsible" && !query) setExpanded(false);
      inputRef.current?.focus();
      return;
    }
    if (!open || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      const product = results[activeIndex];
      inputRef.current?.blur();
      router.push(productHref(locale, product));
      closeAndCollapse();
      return;
    }
    const trimmed = query.trim();
    if (!trimmed) return;
    inputRef.current?.blur();
    router.push(searchPath(locale, trimmed));
    closeAndCollapse();
  }

  const dropdown = open && (
    <div
      id={listId}
      role="listbox"
      className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-button border border-line bg-white text-ink shadow-lg"
    >
      {results.length > 0 ? (
        <>
          <ul>
            {results.map((product, index) => {
              const brand = getBrandBySlug(product.brandSlug);
              return (
                <li key={product.slug}>
                  <Link
                    href={productHref(locale, product)}
                    onClick={handleSuggestionClick}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={clsx(
                      "flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition",
                      index === activeIndex ? "bg-warehouse" : "hover:bg-warehouse",
                    )}
                  >
                    <span>{product.name}</span>
                    {brand && (
                      <span className="shrink-0 rounded-full bg-orange px-2 py-0.5 text-xs font-semibold text-white">
                        {brand.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={searchPath(locale, query)}
            onClick={handleSuggestionClick}
            className="block border-t border-line px-4 py-2.5 text-center text-sm font-semibold text-navy transition hover:text-orange"
          >
            {dict.search.viewAllResults}
          </Link>
        </>
      ) : (
        <p className="px-4 py-4 text-sm text-muted">{dict.search.noResults}</p>
      )}
    </div>
  );

  const inputField = (
    <input
      ref={inputRef}
      type="search"
      value={query}
      onChange={(e) => handleQueryChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        if (results.length > 0) setOpen(true);
      }}
      maxLength={MAX_QUERY_LENGTH}
      placeholder={dict.search.placeholder}
      aria-label={dict.search.placeholder}
      role="combobox"
      aria-expanded={open}
      aria-controls={listId}
      aria-autocomplete="list"
      autoComplete="off"
      className={clsx(inputBase, "py-2 pl-9 pr-3 text-sm")}
    />
  );

  if (variant === "inline") {
    return (
      <div
        ref={wrapperRef}
        className="relative w-44 shrink-0 transition-[width] duration-200 focus-within:w-64"
      >
        <form onSubmit={handleSubmit}>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            strokeWidth={2}
            aria-hidden="true"
          />
          {inputField}
        </form>
        {dropdown}
      </div>
    );
  }

  return (
    <div ref={wrapperRef}>
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={dict.search.openLabel}
        >
          <Search className="size-6" strokeWidth={2} aria-hidden="true" />
        </button>
      ) : (
        <div className="fixed inset-x-0 top-16 z-50 border-t border-steel bg-navy px-4 py-3">
          <div className="relative">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {inputField}
              </div>
              <button
                type="button"
                onClick={() => {
                  closeAndCollapse();
                }}
                aria-label={dict.search.closeLabel}
                className="text-white"
              >
                <X className="size-6" strokeWidth={2} aria-hidden="true" />
              </button>
            </form>
            {dropdown}
          </div>
        </div>
      )}
    </div>
  );
}
