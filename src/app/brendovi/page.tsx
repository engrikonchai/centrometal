import type { Metadata } from "next";
import { BrandsPage } from "@/components/brands/BrandsPage";

export const metadata: Metadata = {
  title: "Brendovi",
  description:
    "Centrometal je ovlašćeni distributer vodećih svjetskih proizvođača alata, mašina i opreme: Bosch, Makita, Einhell, Telwin i drugi.",
  alternates: {
    canonical: "/brendovi",
    languages: { "sr-ME": "/brendovi", en: "/en/brands" },
  },
};

export default function Page() {
  return <BrandsPage locale="mne" />;
}
