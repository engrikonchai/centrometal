import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { Department, InquiryItem, InquiryPayload } from "@/lib/inquiry";
import { hasUsableContact } from "@/lib/inquiry";

const DEPARTMENT_EMAIL: Record<Department, string> = {
  retail: process.env.INQUIRY_EMAIL_RETAIL || "info@centrometal.me",
  wholesale: process.env.INQUIRY_EMAIL_WHOLESALE || "info@centrometal.me",
  service: process.env.INQUIRY_EMAIL_SERVICE || "info@centrometal.me",
};

const DEPARTMENT_LABEL: Record<Department, string> = {
  retail: "Retail",
  wholesale: "Wholesale",
  service: "Service",
};

function isDepartment(value: unknown): value is Department {
  return value === "retail" || value === "wholesale" || value === "service";
}

function validatePayload(body: unknown): { payload: InquiryPayload } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  if (!isDepartment(b.department)) return { error: "Invalid department" };
  if (typeof b.name !== "string" || !b.name.trim()) return { error: "Name is required" };

  const email = typeof b.email === "string" ? b.email : undefined;
  const phone = typeof b.phone === "string" ? b.phone : undefined;
  // The merged form promises "phone OR email — either one is enough", so the
  // old unconditional email requirement would reject valid submissions.
  if (!hasUsableContact({ email, phone })) {
    return { error: "A valid email address or phone number is required" };
  }

  // A Kupovina inquiry can legitimately carry an empty message — the product
  // list is the content. Only require prose when there is no list either.
  const items = parseItems(b.items);
  const hasMessage = typeof b.message === "string" && b.message.trim().length > 0;
  if (!hasMessage && items.length === 0 && b.department !== "wholesale") {
    return { error: "Message is required" };
  }

  const payload: InquiryPayload = {
    department: b.department,
    locale: b.locale === "en" ? "en" : "mne",
    name: b.name,
    email,
    phone,
    company: typeof b.company === "string" ? b.company : undefined,
    brand: typeof b.brand === "string" ? b.brand : undefined,
    categories: Array.isArray(b.categories) ? b.categories.filter((c) => typeof c === "string") : undefined,
    items: items.length > 0 ? items : undefined,
    message: typeof b.message === "string" ? b.message : "",
  };

  return { payload };
}

function parseItems(value: unknown): InquiryItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.name !== "string" || !item.name.trim()) return [];
    const quantity = Number(item.quantity);
    return [
      {
        name: item.name.slice(0, 200),
        quantity: Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1,
      },
    ];
  });
}

function renderEmailBody(payload: InquiryPayload): string {
  const lines = [
    `Department: ${DEPARTMENT_LABEL[payload.department]}`,
    `Locale: ${payload.locale}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone && `Phone: ${payload.phone}`,
    payload.company && `Company: ${payload.company}`,
    payload.brand && `Brand: ${payload.brand}`,
    payload.categories?.length && `Categories: ${payload.categories.join(", ")}`,
    payload.items?.length && "",
    payload.items?.length && "Inquiry list:",
    ...(payload.items ?? []).map((item) => `- ${item.name} x ${item.quantity}`),
    "",
    "Message:",
    payload.message || "(none)",
  ].filter(Boolean);

  return lines.join("\n");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validatePayload(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { payload } = result;

  const to = DEPARTMENT_EMAIL[payload.department];
  const subject = `[${DEPARTMENT_LABEL[payload.department]}] New inquiry from ${payload.name}`;
  const text = renderEmailBody(payload);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    // No email provider configured yet — log instead of failing so the
    // form UX is fully testable before real credentials exist.
    console.info("[inquiry] RESEND_API_KEY/RESEND_FROM_EMAIL not set — logging instead of sending.", {
      to,
      subject,
      text,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      // Phone-only inquiries have nothing to reply to; the number is in the body.
      ...(payload.email ? { replyTo: payload.email } : {}),
      subject,
      text,
    });
    if (error) {
      console.error("[inquiry] Resend error", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[inquiry] Unexpected error sending email", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }
}
