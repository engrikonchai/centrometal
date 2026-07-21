"use client";

import { AlertCircle } from "lucide-react";
import { clsx } from "clsx";

/** Moves focus to the first invalid field (in visual/tab order) after a failed validation pass. */
export function focusFirstError<K extends string>(
  errors: Partial<Record<K, string>>,
  order: readonly K[],
): void {
  const firstKey = order.find((key) => errors[key]);
  if (!firstKey) return;
  const el = document.getElementById(`field-${firstKey}`);
  el?.focus();
}

export const inputBase =
  "w-full rounded-button border bg-surface px-3.5 py-2.5 text-sm text-ink transition " +
  "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal";

function FieldLabel({
  htmlFor,
  label,
  optionalLabel,
  required,
}: {
  htmlFor: string;
  label: string;
  optionalLabel?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-navy">
      {label}
      {!required && optionalLabel && (
        <span className="ml-1 font-normal text-muted">({optionalLabel})</span>
      )}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
      <AlertCircle className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
      {error}
    </p>
  );
}

interface BaseFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  autoComplete?: string;
  placeholder?: string;
}

export function TextField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  optionalLabel,
  autoComplete,
  placeholder,
  type = "text",
}: BaseFieldProps & { type?: "text" | "email" | "tel" }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} optionalLabel={optionalLabel} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={clsx(inputBase, error ? "border-error" : "border-line")}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function TextareaField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  optionalLabel,
  placeholder,
  rows = 5,
}: BaseFieldProps & { rows?: number }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} optionalLabel={optionalLabel} required={required} />
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={clsx(inputBase, "resize-y", error ? "border-error" : "border-line")}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  value,
  onChange,
  error,
  required,
  optionalLabel,
  options,
}: BaseFieldProps & { options: { value: string; label: string }[] }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} optionalLabel={optionalLabel} required={required} />
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={clsx(inputBase, error ? "border-error" : "border-line")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function CheckboxGroupField({
  legend,
  options,
  selected,
  onToggle,
  error,
}: {
  legend: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  error?: string;
}) {
  const errorId = "checkbox-group-error";
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-semibold text-navy">{legend}</legend>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              className="size-4 accent-teal"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
              aria-describedby={error ? errorId : undefined}
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldError id={errorId} error={error} />
    </fieldset>
  );
}
