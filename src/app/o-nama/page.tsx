import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "O nama",
  description:
    "Centrometal D.O.O. — distributer i prodavac alata, mašina i opreme za baštu i domaćinstvo u Podgorici, sa dvije prodavnice i sopstvenim servisom.",
  alternates: {
    canonical: "/o-nama",
    languages: { "sr-ME": "/o-nama", en: "/en/about" },
  },
};

export default function Page() {
  return <AboutPage locale="mne" />;
}
