import { clsx } from "clsx";

/**
 * Handoff spacing: 16px side padding on mobile, 1194px max-width with 24px
 * side padding on tablet, 1280px max-width with 32px side padding on desktop.
 *
 * The tablet measure matches the iPad 11" landscape width exactly, so the
 * layout is edge-to-edge in landscape and simply narrower in portrait — the
 * same container serves both orientations.
 */
export function Container({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  /** For in-page anchors (e.g. the contact page's #o-nama section). */
  id?: string;
}) {
  return (
    <div
      id={id}
      className={clsx(
        "mx-auto w-full max-w-[1280px] px-4 md:max-w-[1194px] md:px-6 xl:max-w-[1280px] xl:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
