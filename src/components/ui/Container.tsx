import { clsx } from "clsx";

/**
 * Handoff spacing: 16px side padding on mobile, 1280px max-width with 32px
 * side padding on desktop.
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
    <div id={id} className={clsx("mx-auto w-full max-w-[1280px] px-4 lg:px-8", className)}>
      {children}
    </div>
  );
}
