import type { Locale } from "@/lib/i18n";
import { Container } from "../ui/Container";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

/** Breadcrumb -> H1 -> short trust-building intro, per the brief's page-skeleton pattern. */
export function PageHeader({
  locale,
  items,
  title,
  intro,
}: {
  locale: Locale;
  items: BreadcrumbItem[];
  title: string;
  intro?: string;
}) {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumb locale={locale} items={items} />
      <h1 className="mt-4 font-heading text-h1 font-bold text-navy">{title}</h1>
      {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
    </Container>
  );
}
