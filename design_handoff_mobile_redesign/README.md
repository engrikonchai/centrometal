# Handoff: Centrometal Website Redesign (Mobile + Desktop)

## Overview
Redesign of centrometal.vercel.app (Next.js tool/hardware distributor site, Podgorica, Montenegro) to fix a broken mobile experience and modernize the visual direction. Covers 5 screen types, each built for both mobile (390px) and desktop (1440px): Home, Category listing, Product detail, Inquiry form (Upit), and Contact.

## About the Design Files
The files in this bundle are **design references built as standalone HTML prototypes** — they show intended layout, styling, copy, and interaction behavior. They are NOT production code to copy/paste. The task is to **recreate these designs in the existing Next.js/React/TypeScript codebase** (repo: `engrikonchai/centrometal`), replacing the corresponding existing components, using the codebase's existing component structure, routing, and data layer (`src/lib/products.ts`, `src/lib/taxonomy.ts`, etc.) rather than introducing a new stack.

Each `.dc.html` file is self-contained: open it in a browser to see it render. The `class Component extends DCLogic` script block in each file is a lightweight custom runtime (not React) — treat its `state`/`renderVals()` as pseudocode showing what state and derived values the real React component needs, not as code to port verbatim.

## Fidelity
**High-fidelity.** Exact colors, spacing, typography, copy, and layout structure shown should be recreated pixel-for-pixel using React/CSS (or the codebase's existing styling approach — check whether it uses Tailwind, CSS modules, or styled-components before choosing an implementation).

## Design direction
"Clean/modern" — NOT literal iOS system UI. Rounded 14–28px cards, generous white space, bold confident type (system font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif`), dark navy gradient accent cards (`#22374a` → `#141f28`) for featured/CTA moments, soft gray `#f5f6f7`/`#f2f2f7` fill cards instead of borders, teal-blue accent `#0a7ea4`, near-black `#11151a`/`#14181d` for primary buttons and text. Avoid: iOS chevron-only back buttons, uppercase section captions, label-left settings-style list rows, bottom tab bars (this is a website, not an app — nav lives in a header + hamburger drawer on mobile, inline nav on desktop).

## Screens / Views

### 1. Home (`Mobile Redesign iOS.dc.html`, `Desktop - Početna.dc.html`)
**Purpose:** Landing page — hero, featured product, department entry points, deals rail, brand trust, wholesale CTA, contact snapshot.
**Mobile layout:** Single column, 16px side padding. Sticky header (60px, translucent blur, hamburger left / cart badge right). Hero: eyebrow + 34px bold H1 + "30+ brendova · 2 lokacije · Sopstveni servis" meta line + 2 CTAs. Featured-product dark gradient card (rounded 26px) below hero. 3-tile quick actions grid removed in latest iteration (folded into hero meta) — verify against latest file. "Iz ponude" horizontal scroll-snap rail (168–170px cards) with a Popust/Novo segmented toggle. "Odjeljenja" as a plain inset-style list (icon chip + label, no dividers — each row is its own white rounded-16px card in the latest pass, check file). "Kupujte po brendu" 3-col logo grid. "Posjetite nas" store-toggle + single embedded map + hours + CTA. Wholesale dark CTA card. "Informacije"/"Kontakt" footer as individual white cards (not divided list rows). Hamburger opens a left slide-in drawer (300px, nav links + Pošaljite upit / Pozovite actions, backdrop dismiss).
**Desktop layout:** Max-width 1280px container. Header: 76px, inline nav (Proizvodi/Brendovi/Veleprodaja/Servis/Kontakt), search field, cart icon, Pozovite button. Hero: 2-col grid (text left, dark gradient featured-product card right). Departments: 4-col icon-card grid. "Iz ponude": 5-col grid with segmented toggle. Brands: 6-col logo grid. Wholesale + map: 2-col split section. Footer: 4-col link columns.

### 2. Category listing (`Kategorija - Alati i oprema.dc.html`, `Desktop - Kategorija.dc.html`)
**Purpose:** Browse/filter products within one department (example: Alati i oprema).
**Mobile:** Header with back button, title, cart. In-page search field. Horizontal subcategory filter chips. Sticky result-count + "Filteri (N)" button opens a bottom sheet (checklist rows for subcategory + brand, "Obriši"/"Gotovo", "Prikaži N proizvoda" button). 2-col product grid, each card: image, badge, brand logo, name, subtitle, "Cijena na upit", full-width "Dodaj u upit" button. Empty state card with call-to-action. "Ne vidite što tražite?" dark CTA card at bottom.
**Desktop:** Breadcrumb + H1 + description. 2-col layout: sticky left sidebar (260px) with subcategory + brand checkbox filters, 4-col product grid on the right. Same empty state and bottom CTA card, full-width.

### 3. Product detail (`Proizvod - Bosch GSB 18V-55.dc.html`, `Desktop - Proizvod.dc.html`)
**Purpose:** Single product page.
**Mobile:** Header with back + wishlist/share icons. Image card. Brand logo + badge + H1 + subtitle. 3-tile spec summary (Napon/Moment/Težina). Description paragraph. Full spec list. "Dokumentacija" as a 2-col icon-card grid (NOT a settings-style link list). Related products horizontal rail. Sticky bottom bar: Pozovite (outlined) + Dodaj u upit (filled, shows "Dodato u upit ✓" confirmation state for ~2.2s).
**Desktop:** Breadcrumb. 2-col layout: image card left, details right (brand/badge/H1/description/3 spec tiles/CTA buttons/documentation cards). Full-width spec table below. Related products 5-col grid at bottom.

### 4. Inquiry / Upit (`Upit.dc.html`, `Desktop - Upit.dc.html`)
**Purpose:** Single merged form replacing 3 separate legacy forms (Contact/Wholesale/Service) — the site's only conversion path since all prices are "na upit" (on request).
**Behavior:** 3-way segmented control: Kupovina / Veleprodaja / Servis. Form adapts per type:
- Kupovina: shows the cart/inquiry list (product thumb, name, qty stepper +/−, remove) + "Dodajte još proizvoda" link.
- Veleprodaja: adds a "Firma" field + toggleable interest category chips.
- Servis: adds an "Alat" (brand/model) field, relabels message field to "Opis problema" with problem-specific placeholder.
Shared fields: Ime, Telefon, E-mail (note: phone OR email required, not both — text explicitly says "dovoljno je jedno"), Poruka/Opis problema. Submit shows a success state (checkmark card, "Pošaljite novi upit" reset link, fallback call CTA).
**Desktop:** Centered single column (max 900px), same field/type logic, 2-col field grid instead of stacked.

### 5. Contact (`Kontakt.dc.html`, `Desktop - Kontakt.dc.html`)
**Purpose:** Contact info + store locator + folds in "O nama" (About) content — no separate About page.
**Content:** Call/email quick actions, contact detail cards (Prodaja/Mobilni/E-mail phone numbers), store segmented toggle (4 Jula / Cetinjski put) with single Google Maps iframe (not two stacked maps like the old site) + full hours (Pon–Pet, Subota, **Nedjelja: Zatvoreno** — this was missing from the original site), wholesale CTA card, "O nama" section with 3 stat tiles (2 prodavnice / 30+ brendova / 1 servis) + 2 body paragraphs + HQ address.

## Interactions & Behavior
- All segmented controls (store toggle, feed type toggle, inquiry type toggle) are simple active/inactive button groups — active state gets white bg + 1px shadow, inactive is transparent.
- Category filter sheet (mobile): fixed-position overlay + bottom sheet, checkbox rows toggle array membership, "Obriši" clears all, count updates live in the "Prikaži N proizvoda" button.
- Product detail "Dodaj u upit": on click, button turns green with "Dodato u upit ✓" for ~2.2s then reverts — no real cart persistence in the prototype, this needs real state/cart wiring in the app.
- Mobile hamburger drawer: slide-in from left, backdrop click or X button closes it.
- Store map: `src="https://www.google.com/maps?q={address}&output=embed"` — swap for the real embed/API key setup already in the repo.

## State Management
Needed in the real implementation:
- Cart/inquiry list state (currently local component state in the prototype — should probably be a persisted cart context, the repo already has `CartContext.tsx`).
- Selected store (0/1) for the map toggle — simple local state.
- Category/brand filter selections (arrays) — likely URL query params in production so filtered views are shareable/bookmarkable (check existing `CategoryBrowser.tsx` for how filters currently sync to the URL).
- Inquiry type (Kupovina/Veleprodaja/Servis) — local state, drives which fields render and which endpoint/payload shape is submitted.
- Mobile menu open/closed — local state.

## Design Tokens
- **Colors:** background `#f2f2f7` (mobile) / `#fff` (desktop body), card fill `#f5f6f7` / white, text primary `#11151a`, text secondary `rgba(60,60,67,0.78)` (kept ≥4.5:1 contrast — do not go lower), accent `#0a7ea4` (hover `#086a8b`), dark/primary-button `#14181d`, success green `#1c7c37` / `rgba(52,199,89,0.14)` bg, gradient accent card `linear-gradient(165deg, #22374a 0%, #141f28 100%)`.
- **Typography:** `-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif`. Scale: 34–56px H1 (letter-spacing ~-0.03 to -0.035em), 22–30px H2, 16–17px body, 13–14.5px small/meta. Weights: 700 headings, 600 semi-bold UI labels/buttons, 500 body emphasis, 400 body.
- **Radius:** 12–16px small cards/buttons, 18–28px large cards/hero, 999px pills/segmented controls/avatars.
- **Shadows:** cards use a single soft shadow `0 1px 3px rgba(17,21,26,0.07-0.08)`, gradient hero/CTA cards use `0 12px 28px rgba(17,21,26,0.2)`.
- **Spacing:** mobile side padding 16px, desktop container max-width 1280px with 32px side padding, section vertical rhythm ~22–34px mobile / 56–64px desktop.

## Assets
Product photos, brand logos, and category imagery were copied directly from the live repo's `public/` folder (`public/products/`, `public/logos/`) — same assets, included in this bundle's `public/` folder. No new/generated imagery was used. Category tile photography (stock images) was tried and then dropped in favor of an icon+label list — if photography is wanted later, it needs a consistent real photoshoot (same background/lighting per product), not stock.

## Files in this bundle
- `Mobile Redesign iOS.dc.html` — Home (mobile)
- `Desktop - Početna.dc.html` — Home (desktop)
- `Kategorija - Alati i oprema.dc.html` — Category listing (mobile)
- `Desktop - Kategorija.dc.html` — Category listing (desktop)
- `Proizvod - Bosch GSB 18V-55.dc.html` — Product detail (mobile)
- `Desktop - Proizvod.dc.html` — Product detail (desktop)
- `Upit.dc.html` — Inquiry form (mobile)
- `Desktop - Upit.dc.html` — Inquiry form (desktop)
- `Kontakt.dc.html` — Contact + About (mobile)
- `Desktop - Kontakt.dc.html` — Contact + About (desktop)
- `public/` — product photos, brand logos, category imagery (copied from the live repo)

## Known placeholders / needs client input
Flag these to the client before shipping as final copy — they are plausible but invented for the prototype:
- Servis section bullets (garancijski/vangarancijski servis, originalni dijelovi, besplatna procjena)
- "Ponuda u roku od 24h" wholesale promise
- "Dostava po cijeloj Crnoj Gori" — confirm actual delivery coverage
- "O nama" body copy (2 paragraphs) — needs the client's real company story
- Product specs (voltage/torque/weight) shown for Bosch GSB 18V-55 — confirm against the actual datasheet
- "Cijena na upit" everywhere — if the client can provide even indicative price ranges for top sellers, that's a bigger UX win than anything else in this bundle (currently the entire catalog is un-shoppable at a glance)
