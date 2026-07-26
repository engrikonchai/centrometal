import { hasUsableContact, isValidEmail, isValidPhone } from "@/lib/inquiry";

// The merged InquiryForm validates required fields inline via its own
// `validate()` closure, exercised through the Playwright E2E specs where it
// runs against the rendered component. This suite covers the exported,
// unit-testable validation helpers — including the phone-or-email rule the
// redesign introduced ("Telefon ili e-mail — dovoljno je jedno"), which is
// enforced identically on the client and in the API route.
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

describe("Form validation: isValidPhone", () => {
  test("should accept a spaced Montenegrin mobile number", () => {
    expect(isValidPhone("+382 69 372 823")).toBe(true);
  });

  test("should accept a local number without a country code", () => {
    expect(isValidPhone("020260528")).toBe(true);
  });

  test("should accept a number with separators", () => {
    expect(isValidPhone("+382 (20) 260-528")).toBe(true);
  });

  test("should reject a number that is too short", () => {
    expect(isValidPhone("12345")).toBe(false);
  });

  test("should reject a value containing letters", () => {
    expect(isValidPhone("call me")).toBe(false);
  });
});

describe("Form validation: hasUsableContact", () => {
  test("should accept an email alone", () => {
    expect(hasUsableContact({ email: "user@example.com" })).toBe(true);
  });

  test("should accept a phone alone", () => {
    expect(hasUsableContact({ phone: "+382 69 372 823" })).toBe(true);
  });

  test("should reject when both are missing", () => {
    expect(hasUsableContact({})).toBe(false);
  });

  test("should reject when both are blank strings", () => {
    expect(hasUsableContact({ email: "   ", phone: "  " })).toBe(false);
  });

  test("should reject when the only channel given is malformed", () => {
    expect(hasUsableContact({ email: "not-an-email" })).toBe(false);
  });

  test("should accept when one channel is valid even if the other is malformed", () => {
    expect(hasUsableContact({ email: "not-an-email", phone: "+382 69 372 823" })).toBe(true);
  });
});
