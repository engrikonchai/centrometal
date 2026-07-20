import type { Metadata } from "next";
import { SearchResultsPage } from "@/components/search/SearchResultsPage";

export const metadata: Metadata = {
  title: "Product search",
  alternates: {
    canonical: "/en/products/search",
    languages: {
      "sr-ME": "/proizvodi/pretraga",
      en: "/en/products/search",
    },
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <SearchResultsPage locale="en" query={q ?? ""} />;
}
