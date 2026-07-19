import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Centrometal D.O.O. — distributor and retailer of tools, machinery and garden & household equipment in Podgorica, with two stores and an in-house service workshop.",
  alternates: {
    canonical: "/en/about",
    languages: { "sr-ME": "/o-nama", en: "/en/about" },
  },
};

export default function Page() {
  return <AboutPage locale="en" />;
}
