import Link from "next/link";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

type CommonProps = {
  variant?: "primary" | "secondary" | "accent" | "outline" | "onDark";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  /** Stretches the button to its container — the handoff's full-width CTAs. */
  block?: boolean;
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

/*
  Handoff: pill buttons (999px), 600 weight, sentence case. The previous
  system's uppercase + 4px-radius treatment is gone. Heights come from the
  design files: 34px inline/chip actions, 42-44px card CTAs, 48-50px
  primary page CTAs.
*/
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold " +
  "tracking-[-0.01em] transition disabled:pointer-events-none disabled:opacity-50";

const sizes = {
  sm: "min-h-[34px] px-3.5 text-sm",
  md: "min-h-[44px] px-5 text-[0.96875rem]",
  lg: "min-h-[50px] px-6 text-[1.03125rem]",
};

const variants = {
  /** Accent fill — the default CTA (Dodaj u upit, Pošaljite upit). */
  primary: "bg-teal text-white hover:bg-teal-hover active:brightness-95",
  /*
    Soft accent fill — the paired secondary action (Pozovite servis,
    Navigacija). The handoff pairs rgba(10,126,164,0.1) with #0a7ea4 text,
    which composites to 4.06:1 and fails AA (confirmed by axe). The label uses
    the darker --color-teal-hover (5.3:1 on the same tint) instead; the fill
    is unchanged.
  */
  secondary: "bg-teal/10 text-teal-ink hover:bg-teal/15 active:bg-teal/20",
  /** Near-black fill — drawer primary and other high-emphasis moments. */
  accent: "bg-navy text-white hover:brightness-125 active:brightness-110",
  /** Hairline outline on light backgrounds (drawer phone button, Pozovite). */
  outline:
    "border-[1.5px] border-navy/15 text-navy hover:border-navy/30 hover:bg-navy/[0.03] active:bg-navy/5",
  /** White fill for use *on* the dark gradient cards. */
  onDark: "bg-white text-[#16222c] hover:bg-white/90 active:bg-white/80",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  block = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(base, sizes[size], variants[variant], block && "w-full", className);

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
