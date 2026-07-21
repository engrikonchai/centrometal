import Link from "next/link";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

type CommonProps = {
  variant?: "primary" | "secondary" | "accent";
  size?: "md" | "lg";
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-button font-body font-semibold uppercase " +
  "text-label tracking-wide transition disabled:pointer-events-none disabled:opacity-50";

const sizes = {
  md: "h-11 px-6",
  lg: "h-12 px-8",
};

const variants = {
  primary: "bg-teal text-white hover:brightness-90 active:brightness-75",
  secondary:
    "border border-teal text-teal bg-transparent hover:bg-teal hover:text-white active:brightness-90",
  accent: "bg-teal text-white hover:brightness-90 active:brightness-75",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(base, sizes[size], variants[variant], className);

  const content = (
    <>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" strokeWidth={2} />}
      {children}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const { disabled, ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
