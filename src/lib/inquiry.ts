import type { Locale } from "./i18n";

export type Department = "retail" | "wholesale" | "service";

/** One line of the customer's inquiry list, carried through to the email. */
export interface InquiryItem {
  name: string;
  quantity: number;
}

export interface InquiryPayload {
  department: Department;
  locale: Locale;
  name: string;
  /**
   * Email and phone are both optional individually, but at least one must be
   * present — the redesigned form says so explicitly ("Telefon ili e-mail —
   * dovoljno je jedno") and `hasUsableContact` enforces it on both sides.
   * The previous forms required email unconditionally.
   */
  email?: string;
  phone?: string;
  company?: string;
  brand?: string;
  categories?: string[];
  /** The Kupovina list — previously flattened into the message body. */
  items?: InquiryItem[];
  message: string;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Loose on purpose: MNE numbers get typed with spaces, +382, and 0-prefixes. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s()\-.]/g, "");
  return /^\+?\d{6,15}$/.test(digits);
}

/** At least one reachable channel, which is what the form promises. */
export function hasUsableContact(input: { email?: string; phone?: string }): boolean {
  const email = input.email?.trim();
  const phone = input.phone?.trim();
  return Boolean((email && isValidEmail(email)) || (phone && isValidPhone(phone)));
}

export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  const res = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Inquiry submission failed with status ${res.status}`);
  }
}
