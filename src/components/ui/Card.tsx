import { clsx } from "clsx";

/*
  Handoff: "soft gray #f5f6f7/#f2f2f7 fill cards instead of borders" — cards
  are borderless white surfaces carrying a single soft shadow. The previous
  system's 1px border + hover lift is gone; `interactive` re-adds a
  restrained hover for cards that are themselves links.
*/
export function Card({
  className,
  children,
  as: As = "div",
  radius = "card",
  interactive = false,
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  /** 14px small cards / 18px default / 22px hero / 26px featured. */
  radius?: "button" | "card" | "hero" | "feature";
  interactive?: boolean;
}) {
  return (
    <As
      className={clsx(
        "bg-surface shadow-card",
        {
          button: "rounded-button",
          card: "rounded-card",
          hero: "rounded-hero",
          feature: "rounded-feature",
        }[radius],
        interactive && "transition hover:shadow-[0_6px_18px_rgba(17,21,26,0.12)]",
        className,
      )}
    >
      {children}
    </As>
  );
}
