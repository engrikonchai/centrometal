import type { Metadata } from "next";
import { ServicePage } from "@/components/service/ServicePage";

export const metadata: Metadata = {
  title: "Service",
  description:
    "Centrometal's own service workshop for repairing and maintaining tools and machinery from leading brands in Podgorica.",
  alternates: {
    canonical: "/en/service",
    languages: { "sr-ME": "/servis", en: "/en/service" },
  },
};

export default function Page() {
  return <ServicePage locale="en" />;
}
