"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import {
  aboutPath,
  brandsPath,
  contactPath,
  homePath,
  servicePath,
  wholesalePath,
} from "@/lib/paths";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { MegaMenu } from "./MegaMenu";
import { LanguageSwitch } from "./LanguageSwitch";
import { SearchBox } from "./SearchBox";

const MEGA_MENU_ID = "products-mega-menu";

export function Header({
  locale,
  alternateHref,
}: {
  locale: Locale;
  alternateHref: string;
}) {
  const dict = getDictionary(locale);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProductsOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const navLinks = [
    { label: dict.nav.brands, href: brandsPath(locale) },
    { label: dict.nav.wholesale, href: wholesalePath(locale) },
    { label: dict.nav.service, href: servicePath(locale) },
    { label: dict.nav.about, href: aboutPath(locale) },
    { label: dict.nav.contact, href: contactPath(locale) },
  ];

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={homePath(locale)}
          className="font-heading text-xl font-bold uppercase tracking-wide text-white"
        >
          Centrometal
        </Link>

        <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex" aria-label="Primary">
          <button
            type="button"
            aria-expanded={productsOpen}
            aria-controls={MEGA_MENU_ID}
            onClick={() => setProductsOpen((open) => !open)}
            className={clsx(
              "flex items-center gap-1 whitespace-nowrap border-b-2 px-2 py-5 text-sm font-semibold uppercase tracking-wide transition xl:px-3",
              productsOpen ? "border-orange" : "border-transparent hover:border-orange",
            )}
          >
            {dict.nav.products}
            <ChevronDown
              className={clsx("size-4 shrink-0 transition-transform", productsOpen && "rotate-180")}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap border-b-2 border-transparent px-2 py-5 text-sm font-semibold uppercase tracking-wide transition hover:border-orange xl:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:gap-5 lg:flex">
          <SearchBox locale={locale} variant="inline" />
          <a
            href="tel:+38220260528"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold transition hover:text-orange-on-dark"
          >
            <Phone className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            +382 20 260-528
          </a>
          <LanguageSwitch locale={locale} alternateHref={alternateHref} />
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <SearchBox locale={locale} variant="collapsible" />
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>

      {productsOpen && (
        <MegaMenu locale={locale} id={MEGA_MENU_ID} onNavigate={() => setProductsOpen(false)} />
      )}

      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-steel bg-navy px-4 py-4 lg:hidden">
          <p className="mb-2 px-2 text-label font-semibold uppercase tracking-wide text-white/60">
            {dict.nav.products}
          </p>
          <ul className="mb-4 grid grid-cols-2 gap-1">
            {categories.map((category) => (
              <li key={category.slug.mne}>
                <Link
                  href={categoryPath(locale, category.slug[locale])}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-button px-2 py-2 text-sm hover:bg-steel"
                >
                  {category.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="border-t border-steel pt-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-button px-2 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-steel"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-steel px-2 pt-3">
            <a href="tel:+38220260528" className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="size-4" strokeWidth={2} aria-hidden="true" />
              +382 20 260-528
            </a>
            <LanguageSwitch locale={locale} alternateHref={alternateHref} />
          </div>
        </div>
      )}
    </header>
  );
}
