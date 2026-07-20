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
});
