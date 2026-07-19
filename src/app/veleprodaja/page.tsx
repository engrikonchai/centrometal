import type { Metadata } from "next";
import { WholesalePage } from "@/components/wholesale/WholesalePage";

export const metadata: Metadata = {
  title: "Veleprodaja",
  description:
    "Veleprodajni uslovi za firme, majstore i gradilišta — alat, mašine i oprema u malim i velikim količinama.",
  alternates: {
    canonical: "/veleprodaja",
    languages: { "sr-ME": "/veleprodaja", en: "/en/wholesale" },
  },
};

export default function Page() {
  return <WholesalePage locale="mne" />;
}
