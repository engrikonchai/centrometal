import { Clock, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { stores } from "@/lib/locations";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";

export function LocationsSection({
  locale,
  heading,
  subheading,
  as: As = "section",
  className = "py-16 sm:py-24",
}: {
  locale: Locale;
  heading: string;
  subheading?: string;
  as?: React.ElementType;
  className?: string;
}) {
  const dict = getDictionary(locale);

  return (
    <As className={className}>
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {stores.map((store) => (
            <Card key={store.name} className="p-6">
              <h3 className="font-heading text-h3 font-semibold text-navy">{store.name}</h3>
              <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal" strokeWidth={2} aria-hidden="true" />
                {store.address}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                <Clock className="size-4 shrink-0 text-teal" strokeWidth={2} aria-hidden="true" />
                {dict.locations.hours}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-navy transition hover:text-teal"
              >
                {dict.locations.viewOnMap} →
              </a>
            </Card>
          ))}
        </div>
      </Container>
    </As>
  );
}
