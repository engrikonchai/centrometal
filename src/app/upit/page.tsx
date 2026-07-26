import type { Metadata } from "next";
import { InquiryPage } from "@/components/forms/InquiryPage";
import { parseInquiryType } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Upit",
  description:
    "Pošaljite upit za kupovinu, veleprodaju ili servis — cijene dajemo na upit i odgovaramo radnim danima, obično isti dan.",
  alternates: {
    canonical: "/upit",
    languages: { "sr-ME": "/upit", en: "/en/inquiry" },
  },
};

/**
 * ?type= is resolved here on the server so the form renders with the right
 * tab already selected — the Veleprodaja and Servis pages deep-link in.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { type } = await searchParams;
  return <InquiryPage locale="mne" initialType={parseInquiryType(type)} />;
}
