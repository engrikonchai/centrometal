import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktirajte Centrometal telefonom, mejlom ili putem forme — maloprodaja, veleprodaja i servis u Podgorici.",
  alternates: {
    canonical: "/kontakt",
    languages: { "sr-ME": "/kontakt", en: "/en/contact" },
  },
};

export default function Page() {
  return <ContactPage locale="mne" />;
}
