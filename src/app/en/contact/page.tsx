import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Centrometal by phone, email or the form below — retail, wholesale and service in Podgorica.",
  alternates: {
    canonical: "/en/contact",
    languages: { "sr-ME": "/kontakt", en: "/en/contact" },
  },
};

export default function Page() {
  return <ContactPage locale="en" />;
}
