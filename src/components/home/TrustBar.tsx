import { BadgeCheck, MapPin, Wrench } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

/** Splits a stat string like "30+ zastupanih brendova" into a punchy leading number and a label. */
function splitStat(label: string): { number?: string; rest: string } {
  const match = label.match(/^(\d+\+?)\s+(.*)$/);
  if (!match) return { rest: label };
  return { number: match[1], rest: match[2] };
}

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
        {items.map(({ icon: Icon, label }, i) => {
          const { number, rest } = splitStat(label);
          return (
            <Reveal key={label} delay={i * 100} className="px-4 py-3 first:pl-0 sm:flex sm:justify-center">
              <div className="flex items-center gap-3">
                <Icon className="size-6 shrink-0 text-orange" strokeWidth={2} aria-hidden="true" />
                {number ? (
                  <span className="flex flex-col leading-none">
                    <span className="font-heading text-2xl font-bold text-orange-on-dark sm:text-3xl">
                      {number}
                    </span>
                    <span className="mt-1 text-xs font-medium uppercase tracking-wide text-white/75">
                      {rest}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm font-semibold">{rest}</span>
                )}
              </div>
            </Reveal>
          );
        })}
      </Container>
    </div>
  );
}
