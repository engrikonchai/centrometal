import { clsx } from "clsx";

export function Card({
  className,
  children,
  as: As = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <As
      className={clsx(
        "rounded-button border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-teal hover:shadow-lg",
        className,
      )}
    >
      {children}
    </As>
  );
}
