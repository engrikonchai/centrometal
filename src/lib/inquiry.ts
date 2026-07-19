import type { Locale } from "./i18n";

export type Department = "retail" | "wholesale" | "service";

export interface InquiryPayload {
  department: Department;
  locale: Locale;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  brand?: string;
  categories?: string[];
  message: string;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
