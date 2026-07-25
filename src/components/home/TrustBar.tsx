import { BadgeCheck, MapPin, Wrench } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";

/** Splits a stat string like "30+ zastupanih brendova" into a punchy leading number and a label. */
function splitStat(label: string): { value?: number; suffix?: string; rest: string } {
  const match = label.match(/^(\d+)(\+?)\s+(.*)$/);
  if (!match) return { rest: label };
  return { value: Number(match[1]), suffix: match[2], rest: match[3] };
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
      {/*
        Mobile: a compact 3-column trust strip (icon stacked over value/label,
        centered, thin dividers) so it costs minimal early scroll height.
        sm+ keeps the original roomier row (icon beside a large number).
      */}
      <Container className="grid grid-cols-3 divide-x divide-white/15 py-3 sm:divide-x sm:py-4">
        {items.map(({ icon: Icon, label }, i) => {
          const { value, suffix, rest } = splitStat(label);
          return (
            <Reveal key={label} delay={i * 100} className="flex justify-center px-2 py-1 sm:px-4 sm:py-3">
              <div className="flex w-full flex-col items-center gap-1 text-center sm:w-auto sm:max-w-xs sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                <Icon
                  className="size-5 shrink-0 text-teal sm:size-6"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {value !== undefined ? (
                  <span className="flex flex-col items-center leading-none sm:items-start">
                    <span className="font-heading text-xl font-bold text-teal-on-dark sm:text-3xl">
                      <CountUp value={value} suffix={suffix} />
                    </span>
                    <span className="mt-1 text-[10px] font-medium uppercase leading-tight tracking-wide text-white/75 sm:text-xs">
                      {rest}
                    </span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-white/90 sm:text-sm sm:normal-case sm:tracking-normal">
                    {rest}
                  </span>
                )}
              </div>
            </Reveal>
          );
        })}
      </Container>
    </div>
  );
}
