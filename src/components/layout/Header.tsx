"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, Phone, ShoppingCart, X } from "lucide-react";
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
import { categoryPath, subcategoryPath } from "@/lib/paths";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { MegaMenu } from "./MegaMenu";
import { LanguageSwitch } from "./LanguageSwitch";
import { SearchBox } from "./SearchBox";
import { CartModal } from "../mobile/CartModal";
import { FavoritesModal } from "../mobile/FavoritesModal";

function HeaderBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-teal px-1 text-[10px] font-bold leading-4 text-white"
    >
      {count}
    </span>
  );
}

const MEGA_MENU_ID = "products-mega-menu";
/** Ignore small scroll jitter (mobile URL bar collapse, momentum scroll) below this delta. */
const SCROLL_HIDE_THRESHOLD = 4;
/** Never hide the header this close to the top. */
const SCROLL_HIDE_MIN_Y = 80;
/** Header switches from its large/transparent resting state to the shrunk/blurred one past this scroll depth. */
const SCROLL_SHRINK_Y = 24;

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
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { count: cartCount } = useCart();
  const { count: favoritesCount } = useFavorites();

  useBodyScrollLock(mobileOpen);

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

  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      if (currentY < SCROLL_HIDE_MIN_Y) {
        setHidden(false);
      } else if (delta > SCROLL_HIDE_THRESHOLD) {
        setHidden(true);
      } else if (delta < -SCROLL_HIDE_THRESHOLD) {
        setHidden(false);
      }
      setScrolled(currentY > SCROLL_SHRINK_Y);
      lastY = currentY;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeMobile() {
    setMobileOpen(false);
    setExpandedDept(null);
  }

  const keepVisible = productsOpen || mobileOpen;
  // Mega menu / mobile drawer need solid contrast behind them even at the top of the page.
  const solid = scrolled || keepVisible;

  const navLinks = [
    { label: dict.nav.brands, href: brandsPath(locale) },
    { label: dict.nav.wholesale, href: wholesalePath(locale) },
    { label: dict.nav.service, href: servicePath(locale) },
    { label: dict.nav.about, href: aboutPath(locale) },
    { label: dict.nav.contact, href: contactPath(locale) },
  ];

  return (
    <>
    <header
      ref={headerRef}
      className={clsx(
        "fixed inset-x-0 top-0 z-40 text-white transition-all duration-300 ease-out motion-reduce:transition-none",
        solid ? "bg-navy shadow-lg backdrop-blur-md" : "bg-navy/55 backdrop-blur-sm",
        hidden && !keepVisible ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div
        className={clsx(
          "mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 transition-[height] duration-300 ease-out motion-reduce:transition-none sm:px-6 lg:flex lg:justify-between lg:px-8",
          solid ? "h-14 lg:h-16" : "h-16 lg:h-24",
        )}
      >
        <div className="flex items-center justify-self-start lg:hidden">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setMobileOpen((open) => !open)}
            className="-ml-2 grid size-11 place-items-center"
          >
            {mobileOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <span className="flex flex-col items-center justify-center gap-1.5" aria-hidden="true">
                <span className="h-0.5 w-7 bg-white" />
                <span className="h-0.5 w-7 bg-white" />
                <span className="h-0.5 w-7 bg-white" />
              </span>
            )}
          </button>
        </div>

        <SearchBox locale={locale} variant="inline" className="w-full min-w-0 lg:hidden" />

        <div className="flex items-center justify-self-end gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`${dict.mobileHeader.cartLabel} (${cartCount})`}
            className={clsx("relative grid size-8 place-items-center", cartCount > 0 ? "text-teal" : "text-white/50")}
          >
            <ShoppingCart className="size-6" strokeWidth={2} aria-hidden="true" />
            <HeaderBadge count={cartCount} />
          </button>
          <button
            type="button"
            onClick={() => setFavoritesOpen(true)}
            aria-label={`${dict.mobileHeader.favoritesLabel} (${favoritesCount})`}
            className={clsx(
              "relative grid size-8 place-items-center",
              favoritesCount > 0 ? "text-teal" : "text-white/50",
            )}
          >
            <Heart
              className="size-6"
              strokeWidth={2}
              fill={favoritesCount > 0 ? "currentColor" : "none"}
              aria-hidden="true"
            />
            <HeaderBadge count={favoritesCount} />
          </button>
          <a
            href="tel:+38220260528"
            aria-label={dict.nav.callUs}
            className="grid size-8 place-items-center text-teal"
          >
            <Phone className="size-6" strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        <Link
          href={homePath(locale)}
          aria-label="Centrometal"
          className="hidden shrink-0 items-center font-heading text-xl font-bold uppercase tracking-wide text-white transition hover:text-teal-on-dark lg:flex"
        >
          Centro<span className="text-teal-on-dark">metal</span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex" aria-label="Primary">
          <button
            type="button"
            aria-expanded={productsOpen}
            aria-controls={MEGA_MENU_ID}
            onClick={() => setProductsOpen((open) => !open)}
            className={clsx(
              "flex items-center gap-1 whitespace-nowrap border-b-2 px-2 py-5 text-sm font-semibold uppercase tracking-wide transition xl:px-3",
              productsOpen ? "border-teal" : "border-transparent hover:border-teal",
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
              className="whitespace-nowrap border-b-2 border-transparent px-2 py-5 text-sm font-semibold uppercase tracking-wide transition hover:border-teal xl:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:gap-5 lg:flex">
          <SearchBox locale={locale} variant="inline" />
          <a
            href="tel:+38220260528"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold transition hover:text-teal-on-dark"
          >
            <Phone className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            +382 20 260-528
          </a>
          <LanguageSwitch locale={locale} alternateHref={alternateHref} />
        </div>
      </div>

      {productsOpen && (
        <MegaMenu locale={locale} id={MEGA_MENU_ID} onNavigate={() => setProductsOpen(false)} />
      )}
    </header>

    <CartModal locale={locale} open={cartOpen} onClose={() => setCartOpen(false)} />
    <FavoritesModal locale={locale} open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />

    {/*
      Always mounted (not conditionally rendered) so both the open AND close transitions
      can play as plain CSS — toggling classes on an existing element animates; mounting
      an element already in its "open" state does not. `inert` when closed keeps the
      drawer's links out of tab order / AT while it's invisible.
    */}
    <div
      onClick={closeMobile}
      aria-hidden="true"
      className={clsx(
        "fixed inset-0 z-[999] bg-black/50 transition-opacity duration-300 ease-in lg:hidden",
        mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    />
    <div
      id="mobile-nav"
      inert={!mobileOpen}
      className={clsx(
        "fixed inset-y-0 left-0 z-[1000] flex w-[75vw] max-w-sm flex-col overflow-y-auto bg-navy shadow-[2px_0_8px_rgba(0,0,0,0.15)] transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0 ease-[cubic-bezier(0.34,1.56,0.64,1)]" : "-translate-x-full ease-in",
      )}
    >
      <button
        type="button"
        onClick={closeMobile}
        aria-label={dict.nav.closeMenu}
        className="absolute right-2 top-2 grid size-11 place-items-center text-white"
      >
        <X className="size-6" strokeWidth={2} aria-hidden="true" />
      </button>

      <nav aria-label="Mobile" className="flex flex-1 flex-col px-4 pb-8 pt-14">
        <p className="mb-2 px-2 text-label font-semibold uppercase tracking-wide text-white/60">
          {dict.nav.products}
        </p>
        <ul className="mb-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedDept === category.slug.mne;
            const panelId = `dept-${category.slug.mne}`;
            return (
              <li key={category.slug.mne} className="border-b border-white/10">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() =>
                    setExpandedDept((prev) =>
                      prev === category.slug.mne ? null : category.slug.mne,
                    )
                  }
                  className="flex min-h-12 w-full items-center gap-2.5 rounded-button px-2 text-left text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Icon className="size-5 shrink-0 text-teal" strokeWidth={2} aria-hidden="true" />
                  <span className="flex-1">{category.name[locale]}</span>
                  <ChevronDown
                    className={clsx(
                      "size-4 shrink-0 text-white/60 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
                {isExpanded && (
                  <ul id={panelId} className="pb-2 pl-9">
                    <li>
                      <Link
                        href={categoryPath(locale, category.slug[locale])}
                        onClick={closeMobile}
                        className="flex min-h-11 items-center rounded-button px-2 text-sm font-semibold text-teal-on-dark transition-colors hover:bg-white/10"
                      >
                        {dict.nav.viewAll} →
                      </Link>
                    </li>
                    {category.subcategories.map((sub) => (
                      <li key={sub.slug.mne}>
                        <Link
                          href={subcategoryPath(locale, category.slug[locale], sub.slug[locale])}
                          onClick={closeMobile}
                          className="flex min-h-11 items-center rounded-button px-2 text-sm text-white/80 transition-colors hover:bg-white/10 active:bg-teal"
                        >
                          {sub.name[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <ul className="border-t border-white/20 pt-3">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMobile}
                className="flex min-h-12 items-center rounded-button px-2 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10 active:bg-teal"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-white/20 px-2 pt-3">
          <a href="tel:+38220260528" className="flex min-h-12 items-center gap-2 text-sm font-semibold text-white">
            <Phone className="size-4" strokeWidth={2} aria-hidden="true" />
            +382 20 260-528
          </a>
          <LanguageSwitch locale={locale} alternateHref={alternateHref} />
        </div>
      </nav>
    </div>
    </>
  );
}
