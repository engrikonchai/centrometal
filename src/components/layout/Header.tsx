"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, Menu, Phone, ShoppingBag, X } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import {
  brandsPath,
  categoryPath,
  contactPath,
  homePath,
  inquiryPath,
  servicePath,
  wholesalePath,
} from "@/lib/paths";
import { categories } from "@/lib/taxonomy";
import { SALES_PHONE, telHref } from "@/lib/contact";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useCart } from "@/contexts/CartContext";
import { MegaMenu } from "./MegaMenu";
import { LanguageSwitch } from "./LanguageSwitch";
import { SearchBox } from "./SearchBox";
import { Button } from "../ui/Button";

const MEGA_MENU_ID = "products-mega-menu";

/** The 36px rounded-square icon buttons flanking the mobile header. */
const mobileIconButton =
  "grid size-9 shrink-0 place-items-center rounded-[10px] bg-[rgba(60,60,67,0.06)] text-ink transition hover:bg-[rgba(60,60,67,0.1)]";

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute -right-[3px] -top-[3px] grid h-4 min-w-4 place-items-center rounded-full bg-teal px-1 text-[10px] font-bold leading-4 text-white"
    >
      {count}
    </span>
  );
}

export interface HeaderMobileConfig {
  /** Replaces the wordmark with a page title (Kategorija/Upit/Kontakt screens). */
  title?: string;
  /** Swaps the hamburger for a back link. Falsy on the home screen. */
  backHref?: string;
  /** Replaces the cart button on the right (e.g. the call button on /upit). */
  actions?: React.ReactNode;
}

/**
 * Handoff header: a 60px translucent bar on mobile and a 76px inline-nav bar
 * on desktop, both sticky with a saturate+blur backdrop.
 *
 * The mobile bar is contextual — the home screen shows hamburger/wordmark/cart
 * while inner screens show back/title/actions — so pages pass a `mobile`
 * config. The desktop bar is identical on every screen.
 *
 * The cart icon now links to /upit rather than opening a modal: the redesign
 * makes the inquiry page itself the cart, which is what the desktop design
 * file does (its cart icon is a link labelled "Upit").
 */
export function Header({
  locale,
  alternateHref,
  mobile,
}: {
  locale: Locale;
  alternateHref: string;
  mobile?: HeaderMobileConfig;
}) {
  const dict = getDictionary(locale);
  const [productsOpen, setProductsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { count: cartCount } = useCart();

  useBodyScrollLock(drawerOpen);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProductsOpen(false);
        setDrawerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function closeDrawer() {
    setDrawerOpen(false);
    setExpandedDept(null);
  }

  const navLinks = [
    { label: dict.nav.brands, href: brandsPath(locale) },
    { label: dict.nav.wholesale, href: wholesalePath(locale) },
    { label: dict.nav.service, href: servicePath(locale) },
    { label: dict.nav.contact, href: contactPath(locale) },
  ];

  const wordmark = (
    <>
      Centro<span className="text-teal-ink">metal</span>
    </>
  );

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-surface/85 shadow-[0_1px_0_rgba(17,21,26,0.07)] backdrop-blur-xl backdrop-saturate-[1.8]"
      >
        {/* Mobile bar — 60px, three slots. */}
        <div className="flex h-[60px] items-center justify-between gap-3 px-4 lg:hidden">
          {mobile?.backHref ? (
            <Link href={mobile.backHref} aria-label={dict.nav.back} className={mobileIconButton}>
              <ChevronLeft className="size-[18px]" strokeWidth={2.3} aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-label={dict.nav.openMenu}
              onClick={() => setDrawerOpen(true)}
              className={mobileIconButton}
            >
              <Menu className="size-[18px]" strokeWidth={2.1} aria-hidden="true" />
            </button>
          )}

          {mobile?.title ? (
            <span className="truncate text-[1.0625rem] font-bold tracking-[-0.025em]">
              {mobile.title}
            </span>
          ) : (
            <Link
              href={homePath(locale)}
              className="text-[1.0625rem] font-bold tracking-[-0.025em] text-ink"
            >
              {wordmark}
            </Link>
          )}

          {mobile?.actions ?? (
            <Link
              href={inquiryPath(locale)}
              aria-label={`${dict.nav.inquiry} (${cartCount})`}
              className={clsx(mobileIconButton, "relative")}
            >
              <ShoppingBag className="size-[18px]" strokeWidth={2} aria-hidden="true" />
              <CartBadge count={cartCount} />
            </Link>
          )}
        </div>

        {/* Desktop bar — 76px, 1280px container. */}
        <div className="mx-auto hidden h-[76px] max-w-[1280px] items-center justify-between px-8 lg:flex">
          <div className="flex items-center gap-12">
            <Link
              href={homePath(locale)}
              className="shrink-0 text-xl font-bold tracking-[-0.02em] text-ink"
            >
              {wordmark}
            </Link>
            <nav className="flex items-center gap-[34px]" aria-label="Primary">
              <button
                type="button"
                aria-expanded={productsOpen}
                aria-controls={MEGA_MENU_ID}
                onClick={() => setProductsOpen((open) => !open)}
                className="flex items-center gap-1 whitespace-nowrap text-[0.9375rem] font-semibold text-ink transition hover:text-teal-ink"
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
                  className="whitespace-nowrap text-[0.9375rem] font-semibold text-ink transition hover:text-teal-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <SearchBox locale={locale} variant="inline" className="w-[260px]" />
            <Link
              href={inquiryPath(locale)}
              aria-label={`${dict.nav.inquiry} (${cartCount})`}
              className="relative grid size-[42px] place-items-center rounded-xl bg-[rgba(60,60,67,0.06)] text-ink transition hover:bg-[rgba(60,60,67,0.1)]"
            >
              <ShoppingBag className="size-[19px]" strokeWidth={1.9} aria-hidden="true" />
              <CartBadge count={cartCount} />
            </Link>
            {/* The one desktop CTA the handoff draws as a 12px chip rather than a pill. */}
            <a
              href={telHref(SALES_PHONE)}
              className="grid h-[42px] place-items-center rounded-xl bg-navy px-5 text-[0.90625rem] font-semibold text-white transition hover:brightness-125"
            >
              {dict.nav.call}
            </a>
            <LanguageSwitch locale={locale} alternateHref={alternateHref} />
          </div>
        </div>

        {productsOpen && (
          <MegaMenu locale={locale} id={MEGA_MENU_ID} onNavigate={() => setProductsOpen(false)} />
        )}
      </header>

      {/*
        Left slide-in drawer. Always mounted (not conditionally rendered) so both
        the open and close transitions can play as plain CSS; `inert` when closed
        keeps its links out of tab order and the accessibility tree.
      */}
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className={clsx(
          "fixed inset-0 z-[999] bg-[rgba(11,16,21,0.45)] transition-opacity duration-300 ease-in lg:hidden",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      {/*
        The whole drawer is the <nav> landmark. The wordmark/close row used to
        sit outside it, which left that content in no landmark at all and
        tripped axe's `region` rule.
      */}
      <nav
        id="mobile-drawer"
        aria-label="Mobile"
        inert={!drawerOpen}
        className={clsx(
          "fixed inset-y-0 left-0 z-[1000] flex w-[300px] max-w-[82vw] flex-col overflow-y-auto bg-surface px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-[18px] shadow-drawer transition-transform duration-300 lg:hidden",
          drawerOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in",
        )}
      >
        <div className="flex h-10 items-center justify-between">
          <span className="text-[1.0625rem] font-bold tracking-[-0.025em]">{wordmark}</span>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={dict.nav.closeMenu}
            className="grid size-[34px] place-items-center rounded-[10px] bg-[rgba(60,60,67,0.06)] text-ink"
          >
            <X className="size-4" strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3.5 flex flex-1 flex-col gap-1">
          {/*
            The handoff draws "Proizvodi" as a flat link, but there is no
            products index route to point it at — categories only exist per
            department. It expands in place instead, so all 8 departments stay
            reachable from the drawer.
          */}
          <button
            type="button"
            aria-expanded={expandedDept === "__products"}
            aria-controls="drawer-products"
            onClick={() =>
              setExpandedDept((prev) => (prev === "__products" ? null : "__products"))
            }
            className="flex min-h-11 items-center gap-2 rounded-xl px-2.5 text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink transition hover:bg-[rgba(60,60,67,0.05)]"
          >
            <span className="flex-1 text-left">{dict.nav.products}</span>
            <ChevronDown
              className={clsx(
                "size-4 shrink-0 text-muted transition-transform",
                expandedDept === "__products" && "rotate-180",
              )}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
          {expandedDept === "__products" && (
            <ul id="drawer-products" className="mb-1 flex flex-col gap-0.5 pl-2.5">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <li key={category.slug.mne}>
                    <Link
                      href={categoryPath(locale, category.slug[locale])}
                      onClick={closeDrawer}
                      className="flex min-h-11 items-center gap-2.5 rounded-xl px-2.5 text-[0.9375rem] text-ink transition hover:bg-[rgba(60,60,67,0.05)]"
                    >
                      <Icon className="size-4 shrink-0 text-teal-ink" strokeWidth={2} aria-hidden="true" />
                      {category.name[locale]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeDrawer}
              className="flex min-h-11 items-center rounded-xl px-2.5 text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink transition hover:bg-[rgba(60,60,67,0.05)]"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-auto flex flex-col gap-2.5 pt-6">
            <Button href={inquiryPath(locale)} variant="accent" size="lg" block onClick={closeDrawer}>
              {dict.nav.sendInquiry}
            </Button>
            <Button href={telHref(SALES_PHONE)} variant="outline" size="lg" block>
              <Phone className="size-4 text-teal-ink" strokeWidth={2.1} aria-hidden="true" />
              {SALES_PHONE}
            </Button>
            <div className="flex justify-center pt-2">
              <LanguageSwitch locale={locale} alternateHref={alternateHref} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
