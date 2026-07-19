import type { Metadata } from "next";
import { ServicePage } from "@/components/service/ServicePage";

export const metadata: Metadata = {
  title: "Servis",
  description:
    "Sopstvena servisna radionica Centrometal za popravku i održavanje alata i mašina vodećih brendova u Podgorici.",
  alternates: {
    canonical: "/servis",
    languages: { "sr-ME": "/servis", en: "/en/service" },
  },
};

export default function Page() {
  return <ServicePage locale="mne" />;
}
