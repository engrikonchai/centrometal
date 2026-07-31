# Handoff: Centrometal — Tablet / iPad breakpoint

## Overview
Addendum to the mobile + desktop redesign already implemented in `engrikonchai/centrometal` (see `design_handoff_mobile_redesign/README.md` — that document's design direction, tokens, copy, state model, and placeholder caveats all still apply and are NOT repeated here).

This bundle covers the **missing middle breakpoint**: iPad and Android tablets, roughly **768–1279px viewport width**. Same 5 screens: Home, Category, Product, Upit, Kontakt.

## What "tablet" means here
Reference device: iPad 10.9" / iPad Pro 11" — **834 × 1194 portrait, 1194 × 834 landscape**. Each prototype is authored fluid (`width: 100%; max-width: 1194px`) so a single implementation must serve both orientations without an orientation-specific branch. Open each file and resize the window between 768 and 1280 to see the intended reflow.

**Do not** ship the mobile layout stretched to 834px (currently what happens — 390px design at 2× width, huge gaps, tiny targets) and **do not** ship the desktop layout squeezed (1280px container with 260px sidebar + 4-col grid does not fit 786px of content width).

## The one thing to get right: this is a TOUCH layout at desktop-ish width
Tablet = desktop information density, mobile input precision. Every interactive element in these files is **≥44px** tall (most are 44–56px), including things that are 32–42px on desktop: header search field, cart button, Pozovite button, filter checkbox rows, segmented-control buttons, qty steppers, footer links. Keep those sizes — do not inherit desktop's 38–42px control heights at this breakpoint.

No hover-only affordances: anything that reveals on `:hover` on desktop must be visible or tappable here.

## Breakpoint implementation
Tailwind default `md:` (768px) → `xl:` (1280px) band, i.e. tablet styles go on `md:` and desktop styles move to `xl:` where they currently sit on `lg:`/`md:`. Verify the repo's actual breakpoint config before assuming — the goal is: mobile < 768, tablet 768–1279, desktop ≥ 1280.

Where possible the prototypes use **intrinsic** grids rather than breakpoint-keyed column counts:
`grid-template-columns: repeat(auto-fill, minmax(210px, 1fr))` etc. Prefer porting these as-is (Tailwind arbitrary values or a small CSS module) over writing separate portrait/landscape column counts — they resolve to the right count in both orientations for free.

## Shared shell (all 5 screens)
**Header — two rows, replaces both the mobile hamburger and the desktop inline nav:**
- Row 1 (`padding: 12px 24px 10px`): wordmark · flex-1 search field (48px tall, radius 14, `rgba(118,118,128,0.12)` fill) · 48px cart icon button with badge · `Pozovite` dark pill (48px, radius 14).
- Row 2: horizontally scrollable category chip rail (40px pills, radius 999, active = `rgba(10,126,164,0.1)` fill + `#0a7ea4` text, `overflow-x: auto` with hidden scrollbar).
- Sticky, translucent `rgba(255,255,255,0.86)` + `backdrop-filter: saturate(180%) blur(20px)`, hairline `box-shadow: 0 1px 0 rgba(17,21,26,0.08)`.
- **No hamburger drawer and no mega-menu at this breakpoint** — the chip rail is the nav. The full department list stays reachable from the Odjeljenja grid on Home and from the sidebar on Category.

**Container:** `max-width: 1194px`, side padding **24px** (vs 16px mobile / 32px desktop). Section vertical rhythm ~40–44px (vs 22–34 mobile / 56–64 desktop).

**Type scale:** H1 34–44px, H2 26–28px, body 16.5px, meta 14–15.5px. Sits between the two existing scales; card body text is deliberately 16.5px (not desktop's 16) because reading distance is longer than phone but hit areas are finger-sized.

## Screens

### 1. Home — `Tablet - Početna.dc.html`
- **Hero:** `repeat(auto-fit, minmax(340px, 1fr))` → side-by-side in landscape, stacked in portrait, no media query. Left: eyebrow, 44px H1, sub, 2 CTAs (52px), then a 3-stat row (30+ brendova / 2 prodavnice / 24h odgovor) above a hairline. Right: dark gradient featured-product card, min-height 380px, product image bottom-anchored.
- **Odjeljenja:** `minmax(180px, 1fr)` auto-fill → 4-up portrait, 6-up landscape. Icon chip top, label bottom-anchored, min-height 128px.
- **Iz ponude:** segmented Na popustu / Novo u ponudi (42px buttons) + **horizontal scroll-snap rail of 232px cards** — deliberately a rail, not a grid, because swiping beats a 3-col grid on touch. `Dodaj u upit` button 44px.
- **Brendovi:** `minmax(150px, 1fr)` auto-fill, 88px tiles, `+24 ostali` tile last. Wrapped in a `showBrands` flag in the prototype — ignore, always render.
- **Veleprodaja + map:** `minmax(330px, 1fr)` auto-fit 2-up; map card carries its own store segmented toggle (4 Jula / Cetinjski put) above the iframe.
- **Footer:** `minmax(170px, 1fr)` auto-fit → 4 columns landscape, 2 portrait. Footer links are 36px-min rows (tap targets), not tight 9px-gap text lists like desktop.

### 2. Category — `Tablet - Kategorija.dc.html`
- **Filters are a persistent 236px left rail, not a bottom sheet.** This is the main tablet-specific decision: there is room for filters and results simultaneously, so the mobile "Filteri (N)" sheet should NOT render at this breakpoint. Rail is a `#f4f5f6` rounded-22px card, `position: sticky; top: 118px` (clears the two-row header), 44px checkbox rows with 20px checkboxes (up from desktop's 38px rows / 16px boxes).
- Grid: `236px minmax(0, 1fr)` with 24px gap; products `minmax(210px, 1fr)` auto-fill → 2-up portrait, 3–4-up landscape.
- Result count, empty state, and the "Ne vidite što tražite?" dark CTA card behave as on desktop; CTA card wraps its button below the text under ~600px of content width.
- Header search placeholder is scoped: "Pretražite u Alati i oprema".

### 3. Product — `Tablet - Proizvod.dc.html`
- Breadcrumb lives **inside the sticky header** (third row) so it survives scrolling — differs from desktop where it's page content.
- `minmax(330px, 1fr)` auto-fit: gallery left / details right in landscape, stacked in portrait.
- **Gallery gains a 4-up thumbnail strip** below the main image (active thumb = 2px `#0a7ea4` border, last tile is a `+3` counter). Mobile has a single image; desktop has none — this is tablet-only and needs real additional product photography per SKU, or fall back to a single image card if only one photo exists.
- Details: brand logo + badge, 32px H1, sub, description, 3 spec tiles, `Dodaj u upit` (54px, green `#1c7c37` + "Dodato u upit ✓" for 2.2s) + `Pozovite` outlined, then a teal availability strip ("Dostupno u prodavnici 4 Jula · servis i garancija kod nas" — **needs real stock data or remove**), then Dokumentacija cards (48px).
- **No sticky bottom action bar** (that's the mobile pattern) — the CTA is above the fold at this width.
- Spec table `minmax(300px, 1fr)` auto-fit → 2 columns landscape, 1 portrait. Related products = 212px scroll-snap rail.

### 4. Upit — `Tablet - Upit.dc.html`
- Centered single column, **max-width 760px** (between mobile full-bleed and desktop 900px) — a form field wider than ~760px hurts scanning.
- Slimmed header: wordmark + cart + Pozovite only, no search, no chip rail (form focus).
- Type segmented control is full-width, 48px buttons. Field grid `1fr 1fr` with 12px gap; Firma / hint / Poruka span both columns. Inputs 17px font (prevents iOS Safari zoom-on-focus — do not drop below 16px).
- Qty steppers are 40px round buttons (mobile/desktop use 32px). List rows 64px thumbs.
- Submit is **full-width** 56px; success card max 600px.

### 5. Kontakt — `Tablet - Kontakt.dc.html`
- Contact cards `minmax(240px, 1fr)` auto-fit, 84px min-height rows → 3-up landscape, 2-up portrait.
- Store toggle sits on the H2 row (wraps below it in portrait); map + info card `minmax(320px, 1fr)` auto-fit, map min-height 300px.
- **O nama order is inverted vs desktop:** body copy first, stat tiles (2 / 30+ / 1) as a 3-col strip after it — reads better in a single narrow column when portrait stacks.
- Google Maps iframe: same `?q={address}&output=embed` placeholder; use the repo's real embed setup. **Verify in a real browser** — the map is the one thing that cannot be checked in the prototype environment.

## Regression checks after implementing
1. 834×1194 and 1194×834 — both orientations, all 5 screens, no horizontal scroll.
2. 768px (smallest tablet) and 1279px (largest) — layout must not break at the band edges.
3. Rotate mid-scroll: sticky header + sticky filter rail must not overlap content.
4. Every tap target ≥44px (audit the header controls, filter rows, footer links, qty steppers).
5. Mobile bottom sheet / hamburger drawer and desktop mega-menu are both correctly suppressed in the 768–1279 band.
6. iPad Safari specifically: `backdrop-filter` needs `-webkit-` prefix (present in the prototypes), `env(safe-area-inset-bottom)` padding on footers, and 16px+ inputs.

## Files
- `Tablet - Početna.dc.html` — Home
- `Tablet - Kategorija.dc.html` — Category listing (Alati i oprema)
- `Tablet - Proizvod.dc.html` — Product detail (Bosch GSB 18V-55)
- `Tablet - Upit.dc.html` — Inquiry form
- `Tablet - Kontakt.dc.html` — Contact + O nama
- `support.js` — prototype runtime (not production code; needed only to open the files locally)
- `public/` — product photos, brand logos, category imagery (copied from the repo)

## New placeholders introduced by this bundle
On top of everything flagged in the mobile handoff:
- Product-gallery thumbnails (4-up strip) assume multiple photos per SKU — the repo currently has one image per product.
- "Dostupno u prodavnici 4 Jula" availability strip — invented; needs real per-store stock or should be cut.
- Home hero "24h odgovor na upit" stat — same unconfirmed 24h promise already flagged for the wholesale copy.
