import { test } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Accessibility", () => {
  test("homepage should have no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });

  test("product category page should have no accessibility violations", async ({ page }) => {
    await page.goto("/proizvodi/alati-i-oprema");
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });

  test("contact page should have no accessibility violations", async ({ page }) => {
    await page.goto("/kontakt");
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });

  test("product detail page should have no accessibility violations", async ({ page }) => {
    await page.goto("/proizvodi/alati-i-oprema/bosch-gsb-18v-55");
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });

  test("inquiry page should have no accessibility violations", async ({ page }) => {
    await page.goto("/upit");
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });

  // The homepage audit above runs at the default desktop viewport, where the
  // mobile-only chrome (departments accordion, hero search) is display:none and
  // therefore invisible to axe. This covers that half of the home screen, with
  // the accordion audited both collapsed and expanded.
  test("home screen (mobile) should have no accessibility violations", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });

    await page.getByRole("button", { name: /Odjeljenja/ }).click();
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });

  // The two overlays are the main new interactive surfaces; axe only sees them
  // once they are actually open.
  test("mobile filter sheet should have no accessibility violations", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/proizvodi/alati-i-oprema");
    await page.getByRole("button", { name: /^Filteri/ }).click();
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });

  test("mobile nav drawer should have no accessibility violations", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "Otvori meni" }).click();
    await injectAxe(page);
    await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } });
  });
});
