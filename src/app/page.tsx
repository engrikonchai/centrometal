import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Alati, mašine i oprema | Podgorica, Crna Gora",
  description:
    "Centrometal D.O.O. — ovlašćeni distributer alata, mašina i baštenske opreme u Podgorici. Preko 30 brendova: Bosch, Makita, Einhell, Telwin i drugi.",
  alternates: {
    canonical: "/",
    languages: { "sr-ME": "/", en: "/en" },
  },
};

export default function Page() {
  return <HomePage locale="mne" />;
}
