import type { Locale } from "@/lib/i18n";
import type { ProductSpec } from "@/lib/products";

/**
 * Handoff: the three headline specs as a row of soft tiles (Napon / Moment /
 * Težina on the reference product), sitting between the H1 and the
 * description. Renders whatever the first three specs happen to be.
 */
export function SpecSummary({ specs, locale }: { specs: ProductSpec[]; locale: Locale }) {
  const tiles = specs.slice(0, 3);
  if (tiles.length === 0) return null;

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${tiles.length}, minmax(0, 1fr))` }}
    >
      {tiles.map((spec) => (
        <div
          key={spec.label[locale]}
          className="rounded-button bg-surface px-2.5 py-[11px] shadow-card md:rounded-2xl md:bg-fill md:p-3.5 md:shadow-none xl:p-4"
        >
          <p className="text-xs text-muted md:text-[0.8125rem] xl:text-[0.78125rem]">
            {spec.label[locale]}
          </p>
          <p className="mt-0.5 text-[1.0625rem] font-semibold tracking-[-0.02em] md:mt-[3px] md:text-[1.1875rem]">
            {spec.value}
          </p>
        </div>
      ))}
    </div>
  );
}
