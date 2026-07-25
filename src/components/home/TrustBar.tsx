import { BadgeCheck, MapPin, Store, Wrench } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

export function TrustBar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const items = [
    { icon: BadgeCheck, label: dict.trustBar.distributor },
    { icon: Wrench, label: dict.trustBar.service },
    { icon: Store, label: dict.trustBar.retail },
    { icon: MapPin, label: dict.trustBar.locations },
  ];

  return (
    <section className="bg-surface">
      {/* Mobile: 2×2 grid of icon cards. Desktop: single 1×4 row. */}
      <Container className="grid grid-cols-2 gap-3 py-6 sm:gap-4 lg:grid-cols-4 lg:py-8">
        {items.map(({ icon: Icon, label }, i) => (
          <Reveal key={label} delay={i * 100} className="h-full">
            <div className="flex h-full flex-col items-center gap-2.5 rounded-button border border-line bg-white px-3 py-5 text-center sm:flex-row sm:gap-3 sm:text-left lg:px-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold leading-tight text-ink">{label}</span>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
