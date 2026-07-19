import type { Metadata } from "next";
import { WholesalePage } from "@/components/wholesale/WholesalePage";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Wholesale terms for businesses, tradespeople and job sites — tools, machinery and equipment in small and large quantities.",
  alternates: {
    canonical: "/en/wholesale",
    languages: { "sr-ME": "/veleprodaja", en: "/en/wholesale" },
  },
};

export default function Page() {
  return <WholesalePage locale="en" />;
}
