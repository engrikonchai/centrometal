import { test, expect } from "@playwright/test";

test.describe("Centrometal E2E", () => {
  // NAVIGATION
  test("should load homepage and navigate to a product category", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Alati/);

    // "Proizvodi" is a mega-menu trigger button (not a link) — it opens a
    // panel of category links rather than navigating directly.
    await page.getByRole("button", { name: "Proizvodi" }).click();
    const megaMenu = page.locator("#products-mega-menu");
    await expect(megaMenu).toBeVisible();
    await megaMenu.locator("a").first().click();
    await expect(page).toHaveURL(/\/proizvodi\//);
  });

  test("should switch from MNE to EN", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Alati/); // MNE

    await page.getByRole("link", { name: "EN", exact: true }).click();
    await expect(page).toHaveURL(/\/en/);
  });

  // FEATURED PRODUCT CARD
  // The old hero carousel is gone; the redesign's dark gradient featured card
  // carries the same product-cycling dots.
  test("should cycle the featured product card via its dots", async ({ page }) => {
    await page.goto("/");

    const dots = page.locator('button[aria-current]').filter({ has: page.locator("span") });
    const dotCount = await dots.count();
    expect(dotCount).toBeGreaterThan(0);

    if (dotCount > 1) {
      await dots.nth(1).click();
      await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
    }
  });

  // INQUIRY FLOW
  test("should add a product to the inquiry list and show it on /upit", async ({ page }) => {
    await page.goto("/proizvodi/alati-i-oprema");

    const addButton = page.getByRole("button", { name: "Dodaj u upit" }).first();
    await addButton.click();
    // The button confirms in place for ~2.2s before reverting.
    await expect(page.getByRole("button", { name: /Dodato u upit/ }).first()).toBeVisible();

    await page.goto("/upit");
    await expect(page.getByRole("heading", { name: /Vaša lista \(1\)/ })).toBeVisible();
  });

  test("should preselect the inquiry type from the ?type= param", async ({ page }) => {
    await page.goto("/upit?type=servis");

    await expect(page.getByRole("button", { name: "Servis" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Servis relabels the message field.
    await expect(page.getByText("Opis problema")).toBeVisible();
  });

  test("should redirect the retired /o-nama to the contact page", async ({ page }) => {
    await page.goto("/o-nama");
    await expect(page).toHaveURL(/\/kontakt/);
    await expect(page.getByRole("heading", { name: "O nama" })).toBeVisible();
  });

  // SEARCH
  test('should search for "bušilica" and show results', async ({ page }) => {
    await page.goto("/");

    // The header now renders both a mobile and a desktop search input (one hidden via
    // CSS depending on viewport) — :visible scopes this to whichever one is actually shown.
    const searchBox = page.locator('input[placeholder*="Pretraži"]:visible');
    await searchBox.fill("bušilica");
    await searchBox.press("Enter");

    await expect(page).toHaveURL(/\/proizvodi\/pretraga/);
    const results = page.locator('[data-testid="product-result"]');
    expect(await results.count()).toBeGreaterThan(0);
  });

  test('should search for "busilica" (no diacritics) and show the same results', async ({ page }) => {
    await page.goto("/");

    // The header now renders both a mobile and a desktop search input (one hidden via
    // CSS depending on viewport) — :visible scopes this to whichever one is actually shown.
    const searchBox = page.locator('input[placeholder*="Pretraži"]:visible');
    await searchBox.fill("busilica");
    await searchBox.press("Enter");

    await expect(page).toHaveURL(/\/proizvodi\/pretraga/);
    const results = page.locator('[data-testid="product-result"]');
    expect(await results.count()).toBeGreaterThan(0);
  });

  // FORMS
  // The three legacy forms are merged into /upit.
  test("should show validation errors on an empty inquiry submit", async ({ page }) => {
    await page.goto("/upit");

    await page.getByRole("button", { name: "Pošaljite upit" }).click();

    await expect(page.getByText("obavezno").first()).toBeVisible();
  });

  test("should reject an inquiry with neither phone nor e-mail", async ({ page }) => {
    await page.goto("/upit?type=servis");

    await page.getByLabel("Ime").fill("Test User");
    await page.getByLabel("Opis problema").fill("Ne pali.");
    await page.getByRole("button", { name: "Pošaljite upit" }).click();

    await expect(page.getByText("Unesite telefon ili e-mail.")).toBeVisible();
  });

  test("should submit a valid inquiry with only a phone number", async ({ page }) => {
    await page.goto("/upit?type=servis");

    await page.getByLabel("Ime").fill("Test User");
    await page.getByLabel("Telefon").fill("+382 69 123 456");
    await page.getByLabel("Opis problema").fill("Ne pali.");

    await page.getByRole("button", { name: "Pošaljite upit" }).click();

    await expect(page.getByText("Upit je poslat")).toBeVisible();
  });

  // RESPONSIVE
  test("should be responsive on mobile (375px) with no horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });

  test("should collapse the departments list on mobile until toggled", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /Odjeljenja/ });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    const firstDepartment = page.getByRole("link", { name: "Alati i oprema", exact: true });
    await expect(firstDepartment).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(firstDepartment).toBeVisible();

    await toggle.click();
    await expect(firstDepartment).toBeHidden();
  });

  test("should not overlap the hero heading and meta line on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // Regression guard for the design-review overlap: assert a real gap
    // between the H1 box and the meta line, not just that both render.
    const gap = await page.evaluate(() => {
      const h1 = document.querySelector("h1")!;
      const meta = h1.nextElementSibling!;
      return meta.getBoundingClientRect().top - h1.getBoundingClientRect().bottom;
    });
    expect(gap).toBeGreaterThanOrEqual(12);
  });

  test("should show a 2-column product grid on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/proizvodi/alati-i-oprema");

    // Verify the computed column count rather than counting visible cards,
    // since a CSS grid keeps every card rendered and just wraps them.
    const categoryGrid = page.locator('[data-testid="category-grid"]');
    const columnCount = await categoryGrid.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
    );
    expect(columnCount).toBe(2);
  });

  test("should open the mobile filter sheet and apply a subcategory filter", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/proizvodi/alati-i-oprema");

    await page.getByRole("button", { name: /^Filteri/ }).click();
    // Scope to the sheet — the same label also exists on the chip row behind it.
    const sheet = page.getByRole("dialog", { name: "Filteri" });
    await sheet.getByRole("button", { name: "Akumulatorski alati" }).click();

    // Filters live in the URL so the view is shareable.
    await expect(page).toHaveURL(/sub=akumulatorski-alati/);
    await expect(page.getByRole("button", { name: /^Filteri \(1\)/ })).toBeVisible();
  });

  // SERVER RENDERING
  test("should server-render the category product grid", async ({ request }) => {
    // Regression guard: CategoryBrowser previously read filters via
    // useSearchParams inside a Suspense boundary, which excluded the whole
    // grid from the prerender — the HTML shipped zero product cards and they
    // only appeared after hydration. Fetching the raw HTML (no JS executed)
    // is the only way to catch that; a normal page.goto() hides it.
    const response = await request.get("/proizvodi/alati-i-oprema");
    expect(response.ok()).toBe(true);
    const html = await response.text();

    const cards = html.match(/data-testid="product-result"/g) ?? [];
    expect(cards.length).toBeGreaterThan(1);
    // Product names must be in the markup for crawlers, not just the DOM.
    expect(html).toContain("Bosch GSB 18V-55");
  });

  test("should server-render the inquiry form with the deep-linked type selected", async ({
    request,
  }) => {
    // The form used to read ?type= with useSearchParams inside a Suspense
    // boundary, which kept it out of the prerender entirely and made the
    // Veleprodaja/Servis deep links flash the Kupovina tab before correcting.
    const response = await request.get("/upit?type=servis");
    expect(response.ok()).toBe(true);
    const html = await response.text();

    // The form itself is in the markup, not just after hydration.
    expect(html).toContain("Vaši podaci");
    // ...and the Servis tab is already the pressed one, server-side.
    expect(html).toMatch(/aria-pressed="true"[^>]*>Servis</);
  });

  // IMAGES
  test("should load all real product images on a category page", async ({ page }) => {
    await page.goto("/proizvodi/alati-i-oprema");

    const images = page.locator('[data-testid="product-result"] img');
    // The grid is client-rendered (CategoryBrowser calls useSearchParams inside
    // a Suspense boundary, so the subtree is excluded from the prerender), so
    // wait for hydration rather than counting immediately.
    await images.first().waitFor();
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const width = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      const height = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    }
  });

  // BRAND LOGOS
  test("should display the represented brands", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Kupujte po brendu").scrollIntoViewIfNeeded();

    const logos = page.locator('[data-testid="brand-logo"]');
    const logoCount = await logos.count();

    // The redesigned grid tiles only brands that have a logo asset in
    // /public/logos (currently 5); the rest of the 30+ roster is folded into
    // the trailing "+N ostali" tile pending the CMS import.
    expect(logoCount).toBe(5);

    for (let i = 0; i < logoCount; i++) {
      const width = await logos
        .nth(i)
        .locator("img")
        .evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(width).toBeGreaterThan(0);
    }

    await expect(page.getByText(/^\+\d+ ostali$/)).toBeVisible();
  });

  // ACCESSIBILITY
  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    expect(await page.locator("h1").count()).toBeGreaterThan(0);
    expect(await page.locator("h2").count()).toBeGreaterThan(0);
  });

  test("should have alt text on all images", async ({ page }) => {
    await page.goto("/");

    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).not.toBeNull();
    }
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);

    expect(["BUTTON", "A", "INPUT"]).toContain(focused);
  });
});
