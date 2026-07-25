import { Clock, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { stores } from "@/lib/locations";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Reveal } from "../ui/Reveal";

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
          {stores.map((store, i) => (
            <Reveal key={store.name} delay={i * 100} className="h-full">
              <Card className="flex h-full flex-col overflow-hidden">
                <div className="aspect-video w-full overflow-hidden bg-warehouse">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed`}
                    title={`Google Maps — ${store.name}`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-6">
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
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </As>
  );
}
