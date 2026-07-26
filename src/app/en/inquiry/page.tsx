import type { Metadata } from "next";
import { InquiryPage } from "@/components/forms/InquiryPage";
import { parseInquiryType } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Inquiry",
  description:
    "Send an inquiry for a purchase, wholesale or service — all prices are on request and we reply on working days, usually the same day.",
  alternates: {
    canonical: "/en/inquiry",
    languages: { "sr-ME": "/upit", en: "/en/inquiry" },
  },
};

/** See the note in /upit/page.tsx — ?type= is resolved server-side. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { type } = await searchParams;
  return <InquiryPage locale="en" initialType={parseInquiryType(type)} />;
}
