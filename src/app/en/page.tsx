import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Tools, Machinery & Equipment | Podgorica, Montenegro",
  description:
    "Centrometal D.O.O. — authorized distributor of tools, machinery and garden equipment in Podgorica. 30+ brands: Bosch, Makita, Einhell, Telwin and more.",
  alternates: {
    canonical: "/en",
    languages: { "sr-ME": "/", en: "/en" },
  },
};

export default function Page() {
  return <HomePage locale="en" />;
}
