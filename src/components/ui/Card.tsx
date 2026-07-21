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
        "rounded-button border border-line bg-surface transition hover:-translate-y-0.5 hover:border-teal",
        className,
      )}
    >
      {children}
    </As>
  );
}
