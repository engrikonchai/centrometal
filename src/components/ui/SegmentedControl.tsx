"use client";

import { clsx } from "clsx";

export interface Segment<T extends string> {
  value: T;
  label: string;
}

/**
 * The handoff's segmented control, shared by the store toggle, the "Iz
 * ponude" feed toggle and the inquiry-type toggle: active gets a white fill
 * + 1px shadow, inactive is transparent on a tinted track.
 *
 * Rendered as a group of `aria-pressed` buttons rather than a tablist —
 * only some usages actually own a panel, and a tablist would promise
 * arrow-key semantics these controls don't implement.
 *
 * Contrast note: the design files set inactive labels to
 * rgba(60,60,67,0.7), which composites to 3.96:1 on the track and fails AA
 * at this 13.5px size. Inactive labels use --color-muted instead (4.6:1),
 * per the handoff's "do not go lower" instruction on secondary text.
 */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  label,
  className,
}: {
  segments: readonly Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group as a whole. */
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={clsx("grid gap-0.5 rounded-[9px] bg-[rgba(118,118,128,0.12)] p-0.5", className)}
      style={{ gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))` }}
    >
      {segments.map((segment) => {
        const active = segment.value === value;
        return (
          <button
            key={segment.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(segment.value)}
            className={clsx(
              "min-h-8 rounded-[7px] px-2 text-[0.84375rem] font-semibold tracking-[-0.01em] transition",
              active ? "bg-surface text-ink shadow-segment" : "bg-transparent text-muted",
            )}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
