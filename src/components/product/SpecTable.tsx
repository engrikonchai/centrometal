import type { Locale } from "@/lib/i18n";
import type { ProductSpec } from "@/lib/products";

/**
 * Handoff: full specification as hairline-divided label/value rows inside a
 * single soft card — the previous bordered <table> with a gray label column
 * is gone. Kept as a real table for semantics.
 *
 * Tablet reflows the rows into an intrinsic `minmax(300px, 1fr)` grid, which
 * resolves to two columns in both iPad orientations and falls back to one on
 * narrower tablets without an orientation branch. The hairline divider is a
 * 1px grid gap over a tinted background there, since `divide-hairline`'s
 * "border on every row but the first" only reads correctly in a single column.
 */
export function SpecTable({ specs, locale }: { specs: ProductSpec[]; locale: Locale }) {
  return (
    <div className="overflow-hidden rounded-button bg-surface shadow-card md:rounded-[18px] md:bg-navy/[0.08] md:shadow-none xl:bg-fill">
      <table className="w-full">
        <tbody className="divide-hairline md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-px xl:block">
          {specs.map((spec) => (
            <tr
              key={spec.label[locale]}
              className="flex min-h-[46px] items-center justify-between gap-3 px-4 py-2 md:border-t-0 md:bg-surface md:px-5 md:py-4 xl:bg-transparent xl:px-4 xl:py-2"
            >
              <th
                scope="row"
                className="text-left text-[1.03125rem] font-normal tracking-[-0.015em] text-muted"
              >
                {spec.label[locale]}
              </th>
              <td className="text-[1.03125rem] font-medium tracking-[-0.015em]">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
