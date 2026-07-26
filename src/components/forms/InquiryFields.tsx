"use client";

import { useId } from "react";
import { clsx } from "clsx";

/*
  Handoff field style: a borderless soft card with a small caption label above
  the value, rather than the previous bordered input + floating label. Errors
  are shown inline under the card.
*/
const cardBase =
  "rounded-button bg-surface px-3.5 py-3 shadow-card lg:rounded-2xl lg:bg-fill lg:shadow-none";
const labelBase = "mb-[3px] block text-[0.78125rem] font-semibold text-[#3c3c43]";
const controlBase =
  "block w-full border-0 bg-transparent p-0 text-[1.03125rem] tracking-[-0.015em] text-ink " +
  "placeholder:text-muted";

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
      <div className={clsx(cardBase, error && "ring-1 ring-error")}>
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
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
      </div>
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
      <label htmlFor={id} className="mb-2.5 block text-h2 font-bold">
        {label}
      </label>
      <div
        className={clsx(
          "overflow-hidden rounded-button bg-surface shadow-card lg:bg-fill lg:shadow-none",
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
          className={clsx(controlBase, "resize-none px-4 py-3.5 leading-[1.45]")}
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
