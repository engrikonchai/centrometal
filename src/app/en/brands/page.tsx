import type { Metadata } from "next";
import { BrandsPage } from "@/components/brands/BrandsPage";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Centrometal is an authorized distributor for leading global tool and equipment manufacturers: Bosch, Makita, Einhell, Telwin and more.",
  alternates: {
    canonical: "/en/brands",
    languages: { "sr-ME": "/brendovi", en: "/en/brands" },
  },
};

export default function Page() {
  return <BrandsPage locale="en" />;
}
