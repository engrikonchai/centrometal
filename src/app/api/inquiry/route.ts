import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { Department, InquiryPayload } from "@/lib/inquiry";
import { isValidEmail } from "@/lib/inquiry";

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
  if (typeof b.email !== "string" || !isValidEmail(b.email)) return { error: "Valid email is required" };
  if (typeof b.message !== "string" || !b.message.trim()) {
    // The wholesale form's message is optional client-side; only enforce
    // server-side for departments where it's the primary content field.
    if (b.department !== "wholesale") return { error: "Message is required" };
  }

  const payload: InquiryPayload = {
    department: b.department,
    locale: b.locale === "en" ? "en" : "mne",
    name: b.name,
    email: b.email,
    phone: typeof b.phone === "string" ? b.phone : undefined,
    company: typeof b.company === "string" ? b.company : undefined,
    brand: typeof b.brand === "string" ? b.brand : undefined,
    categories: Array.isArray(b.categories) ? b.categories.filter((c) => typeof c === "string") : undefined,
    message: typeof b.message === "string" ? b.message : "",
  };

  return { payload };
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
      replyTo: payload.email,
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
