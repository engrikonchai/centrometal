import { BadgeCheck, MapPin, Wrench } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "../ui/Container";

export function TrustBar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const items = [
    { icon: MapPin, label: dict.trustBar.locations },
    { icon: Wrench, label: dict.trustBar.service },
    { icon: BadgeCheck, label: dict.trustBar.brands },
  ];

  return (
    <div className="bg-steel text-white">
      <Container className="grid grid-cols-1 divide-y divide-white/15 py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3 first:pl-0 sm:justify-center">
            <Icon className="size-5 shrink-0 text-orange" strokeWidth={2} aria-hidden="true" />
            <span className="text-sm font-semibold">{label}</span>
          </div>
        ))}
      </Container>
    </div>
  );
}
