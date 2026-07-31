"use client";

import { useId } from "react";
import { clsx } from "clsx";

/*
  Handoff field style: a borderless soft card with a small caption label above
  the value, rather than the previous bordered input + floating label. Errors
  are shown inline under the card.
*/
const cardBase =
  "rounded-button bg-surface px-3.5 py-3 shadow-card md:rounded-[18px] md:bg-fill md:px-[18px] " +
  "md:py-3.5 md:shadow-none xl:rounded-2xl";
const labelBase =
  "mb-[3px] block text-[0.78125rem] font-semibold text-[#3c3c43] md:mb-1 md:text-[0.8125rem]";
/*
  16.5px on mobile/desktop, 17px on tablet per the handoff. Both clear iOS
  Safari's 16px zoom-on-focus threshold — going below that makes the browser
  scale the whole page when a field is tapped, which on a form this long is
  disorienting. Do not reduce.
*/
const controlBase =
  "block w-full border-0 bg-transparent p-0 text-[1.03125rem] tracking-[-0.015em] text-ink " +
  "placeholder:text-muted md:text-[1.0625rem]";

export function InquiryField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  autoComplete,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "tel" | "email";
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  className?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {/*
        The caption and input sit inside one <label> rather than a <label
        htmlFor> beside the input: the input's own line-height leaves it well
        under the 44px touch minimum, but a wrapping label makes the whole
        padded card focus it on tap, so the effective target is the full card
        (60px+) without changing how the field looks.
      */}
      <label className={clsx(cardBase, "block", error && "ring-1 ring-error")}>
        <span className={labelBase}>{label}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={controlBase}
        />
      </label>
      {error && (
        <p id={errorId} className="mt-1 px-1 text-[0.8125rem] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function InquiryTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  /** Rendered as the section heading above the card, per the design. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-h2 font-bold md:text-[1.3125rem] md:tracking-[-0.025em]">
        {label}
      </label>
      <div
        className={clsx(
          "overflow-hidden rounded-button bg-surface shadow-card md:rounded-[18px] md:bg-fill md:shadow-none",
          error && "ring-1 ring-error",
        )}
      >
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={clsx(controlBase, "resize-none px-4 py-3.5 leading-[1.45] md:px-[18px] md:leading-[1.5]")}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1 px-1 text-[0.8125rem] text-error">
          {error}
        </p>
      )}
    </div>
  );
}
