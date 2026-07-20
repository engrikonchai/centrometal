import { isValidEmail } from "@/lib/inquiry";

// The codebase has no standalone `validateForm`/generic validator — each
// form (ContactForm, ServiceForm, WholesaleForm) validates required fields
// inline via its own `validate()` closure. That inline logic is exercised
// through the Playwright E2E contact-form tests instead, where it actually
// runs against the rendered component. This suite covers the one exported,
// unit-testable piece of form logic: email validation.
describe("Form validation: isValidEmail", () => {
  test("should reject an invalid email", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  test("should reject an email missing a domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  test("should reject an email with a space", () => {
    expect(isValidEmail("user name@example.com")).toBe(false);
  });

  test("should accept a valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  test("should accept a valid email with a subdomain", () => {
    expect(isValidEmail("user@mail.example.co.me")).toBe(true);
  });
});
