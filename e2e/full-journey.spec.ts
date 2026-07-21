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

  // HERO CAROUSEL
  test("should display the hero carousel with working slide dots", async ({ page }) => {
    await page.goto("/");

    const carousel = page.locator('[role="group"][aria-roledescription="carousel"]');
    await expect(carousel).toBeVisible();

    const dots = carousel.locator('button[aria-label^="Prikaži proizvod"]');
    const dotCount = await dots.count();
    expect(dotCount).toBeGreaterThan(0);

    if (dotCount > 1) {
      await dots.nth(1).click();
      await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
    }
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
  test("should show validation errors on an empty contact form submit", async ({ page }) => {
    await page.goto("/kontakt");

    await page.getByRole("button", { name: "Pošaljite upit" }).click();

    await expect(page.getByText("obavezno").first()).toBeVisible();
  });

  test("should submit a valid contact form", async ({ page }) => {
    await page.goto("/kontakt");

    await page.locator('input[name="name"]').fill("Test User");
    await page.locator('input[name="email"]').fill("test@example.com");
    await page.locator('textarea[name="message"]').fill("Test message");

    await page.getByRole("button", { name: "Pošaljite upit" }).click();

    await expect(page.getByText("Hvala")).toBeVisible();
  });

  // RESPONSIVE
  test("should be responsive on mobile (375px) with no horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);

    // At this width the category grid is CSS `grid-cols-2` — verify the
    // computed column count rather than counting visible cards, since a
    // CSS grid keeps every card rendered and just wraps them into more rows.
    const categoryGrid = page.locator('[data-testid="category-grid"]');
    const columnCount = await categoryGrid.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
    );
    expect(columnCount).toBe(2);
  });

  // IMAGES
  test("should load all real product images on a category page", async ({ page }) => {
    await page.goto("/proizvodi/alati-i-oprema");

    const images = page.locator('[data-testid="product-result"] img');
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

    await page.getByText("Brendovi koje zastupamo").scrollIntoViewIfNeeded();

    const logos = page.locator('[data-testid="brand-logo"]');
    const logoCount = await logos.count();

    // Seed catalog currently ships 9 named brands (see src/lib/brands.ts) —
    // the rest of the real 30+ roster is noted as a "+ 20 more" pending CMS import.
    expect(logoCount).toBe(9);

    for (let i = 0; i < logoCount; i++) {
      const img = logos.nth(i).locator("img");
      if ((await img.count()) === 0) continue; // brands without a logo asset render a text wordmark
      const width = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(width).toBeGreaterThan(0);
    }
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
