"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { searchPath } from "@/lib/paths";

const MAX_QUERY_LENGTH = 100;

/**
 * Prominent hero search: a full-width boxed input + teal submit button that
 * routes to the search results page. Kept deliberately simple (no live
 * suggestions) — the header SearchBox already provides autocomplete site-wide.
 */
export function HeroSearch({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(searchPath(locale, trimmed));
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full max-w-xl gap-2">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted"
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={MAX_QUERY_LENGTH}
          placeholder={dict.hero.searchPlaceholder}
          aria-label={dict.hero.searchPlaceholder}
          autoComplete="off"
          className="h-12 w-full rounded-button bg-white pl-10 pr-3 text-base text-ink shadow-sm placeholder:text-muted"
        />
      </div>
      <button
        type="submit"
        className="h-12 shrink-0 rounded-button bg-teal px-5 text-label font-semibold uppercase tracking-wide text-white transition hover:brightness-90 active:brightness-75"
      >
        {dict.hero.searchButton}
      </button>
    </form>
  );
}
