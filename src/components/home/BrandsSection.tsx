import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { format, getDictionary } from "@/lib/dictionary";
import { brands } from "@/lib/brands";
import { brandsPath } from "@/lib/paths";

/**
 * "Kupujte po brendu" — a 3-column logo grid on mobile, 6-column on desktop,
 * with a trailing "+N ostali" tile.
 *
 * Only brands with a logo asset are tiled; the rest are folded into the
 * counter. The client has confirmed "30+ brendova" but only five logo files
 * exist in /public/logos, so the counter is padded to that claim.
 */
const CLAIMED_BRAND_COUNT = 30;

export function BrandsSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const withLogos = brands.filter((brand) => brand.logo);
  const remaining = Math.max(CLAIMED_BRAND_COUNT - withLogos.length, 0);

  return (
    /* Horizontal padding is owned by the parent Container. */
    <section className="pb-[22px] lg:pb-0">
      <h2 className="mb-3 text-h2 font-bold lg:mb-8 lg:text-h2-lg">{dict.home.brandsHeading}</h2>

      <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-6 lg:gap-5">
        {withLogos.map((brand) => (
          <Link
            key={brand.slug}
            href={brandsPath(locale)}
            data-testid="brand-logo"
            className="grid h-[62px] place-items-center rounded-button bg-surface p-3 shadow-card transition hover:shadow-[0_4px_12px_rgba(17,21,26,0.1)] lg:h-20 lg:bg-fill lg:shadow-none lg:hover:bg-[#eeeff1]"
          >
            <span className="relative block h-6 w-full">
              <Image
                src={brand.logo!}
                alt={brand.name}
                fill
                quality={95}
                sizes="120px"
                className="object-contain"
              />
            </span>
          </Link>
        ))}

        {remaining > 0 && (
          <Link
            href={brandsPath(locale)}
            className="grid h-[62px] place-items-center rounded-button bg-teal/10 text-center text-[0.84375rem] font-semibold leading-[1.25] text-teal-ink transition hover:bg-teal/15 lg:h-20"
          >
            {format(dict.home.brandsMoreTemplate, { count: remaining })}
          </Link>
        )}
      </div>
    </section>
  );
}
