"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Minus, Plus } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n";
import { format, getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { categoryPath } from "@/lib/paths";
import { SALES_PHONE, telHref } from "@/lib/contact";
import { hasUsableContact, isValidEmail, submitInquiry, type Department } from "@/lib/inquiry";
import type { InquiryType as PathInquiryType } from "@/lib/paths";
import { useCart } from "@/contexts/CartContext";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Button } from "../ui/Button";
import { FormStatusBanner } from "./FormStatusBanner";
import { InquiryField, InquiryTextarea } from "./InquiryFields";

/** URL-facing type values map onto the API's existing department names. */
const DEPARTMENT_BY_TYPE: Record<PathInquiryType, Department> = {
  kupovina: "retail",
  veleprodaja: "wholesale",
  servis: "service",
};

interface Values {
  name: string;
  phone: string;
  email: string;
  company: string;
  tool: string;
  message: string;
}

const initialValues: Values = {
  name: "",
  phone: "",
  email: "",
  company: "",
  tool: "",
  message: "",
};

/**
 * The merged inquiry form — one conversion path replacing the separate
 * contact, wholesale and service forms.
 *
 * The three types share Ime/Telefon/E-mail/Poruka and differ in what they add:
 * Kupovina surfaces the inquiry list (CartContext), Veleprodaja adds a Firma
 * field plus interest chips, Servis adds an Alat field and relabels the
 * message to "Opis problema".
 *
 * `initialType` is resolved from ?type= on the server rather than read here
 * with useSearchParams — that hook would exclude the entire form from the
 * prerender, and would also make the deep-linked tab flash Kupovina before
 * correcting itself after hydration.
 */
export function InquiryForm({
  locale,
  initialType,
}: {
  locale: Locale;
  initialType: PathInquiryType;
}) {
  const dict = getDictionary(locale);
  const cart = useCart();

  const [type, setType] = useState<PathInquiryType>(initialType);
  const [values, setValues] = useState<Values>(initialValues);
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "contact", string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const isRetail = type === "kupovina";
  const isWholesale = type === "veleprodaja";
  const isService = type === "servis";

  function setValue<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const next: Partial<Record<keyof Values | "contact", string>> = {};
    if (!values.name.trim()) next.name = dict.form.requiredError;
    if (!hasUsableContact({ email: values.email, phone: values.phone })) {
      next.contact = dict.inquiry.contactRequiredError;
    } else if (values.email.trim() && !isValidEmail(values.email.trim())) {
      next.email = dict.form.emailError;
    }
    // Servis has nothing but prose to go on; Kupovina can lean on the list.
    if (isService && !values.message.trim()) next.message = dict.form.requiredError;
    if (isRetail && cart.items.length === 0 && !values.message.trim()) {
      next.message = dict.form.requiredError;
    }
    setErrors(next);
    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (Object.keys(validate()).length > 0) return;

    setStatus("submitting");
    try {
      await submitInquiry({
        department: DEPARTMENT_BY_TYPE[type],
        locale,
        name: values.name,
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        company: isWholesale ? values.company || undefined : undefined,
        brand: isService ? values.tool || undefined : undefined,
        categories: isWholesale && interests.length > 0 ? interests : undefined,
        items: isRetail
          ? cart.items.map((item) => ({ name: item.name, quantity: item.quantity }))
          : undefined,
        message: values.message,
      });
      if (isRetail) cart.clear();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setValues(initialValues);
    setInterests([]);
    setErrors({});
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div className="px-4 pb-7 pt-10 lg:px-0">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3.5 rounded-hero bg-surface px-[22px] py-[30px] text-center shadow-card lg:bg-fill lg:shadow-none">
          <span className="grid size-14 place-items-center rounded-full bg-success-bg">
            <Check className="size-7 text-green" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <p className="text-h2 font-bold">{dict.inquiry.successTitle}</p>
          <p className="text-[0.96875rem] leading-[1.5] text-muted">{dict.inquiry.successBody}</p>
          <Button href={telHref(SALES_PHONE)} variant="primary" block>
            {format(dict.inquiry.successCallTemplate, { phone: SALES_PHONE })}
          </Button>
          <button
            type="button"
            onClick={reset}
            className="p-1.5 text-[0.96875rem] font-medium text-teal-ink transition hover:text-teal-hover"
          >
            {dict.inquiry.sendAnother}
          </button>
        </div>
      </div>
    );
  }

  const messageLabel = isService ? dict.inquiry.issueLabel : dict.inquiry.messageLabel;
  const messagePlaceholder = isService
    ? dict.inquiry.placeholderService
    : isWholesale
      ? dict.inquiry.placeholderWholesale
      : dict.inquiry.placeholderRetail;
  const typeHint = isService
    ? dict.inquiry.hintService
    : isWholesale
      ? dict.inquiry.hintWholesale
      : dict.inquiry.hintRetail;

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-[900px]">
      <div className="px-4 pt-2.5 lg:px-0">
        <p className="text-[0.9375rem] leading-[1.45] text-muted">{dict.inquiry.intro}</p>

        <SegmentedControl
          label={dict.inquiry.typeLabel}
          value={type}
          onChange={setType}
          segments={[
            { value: "kupovina", label: dict.inquiry.typeRetail },
            { value: "veleprodaja", label: dict.inquiry.typeWholesale },
            { value: "servis", label: dict.inquiry.typeService },
          ]}
          className="mt-3.5"
        />

        <p className="mt-2.5 text-[0.90625rem] leading-[1.45] text-muted">{typeHint}</p>
      </div>

      {isRetail && (
        <section className="px-4 pt-5 lg:px-0">
          <h2 className="mb-2.5 text-h2 font-bold">
            {format(dict.inquiry.listHeadingTemplate, { count: cart.items.length })}
          </h2>
          <div className="divide-hairline overflow-hidden rounded-button bg-surface shadow-card lg:bg-fill lg:shadow-none">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3.5 py-3">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-[10px] bg-[#f7f7f9] object-contain"
                  />
                ) : (
                  <span className="size-12 shrink-0 rounded-[10px] bg-[#f7f7f9]" aria-hidden="true" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-[0.96875rem] font-semibold leading-[1.25] tracking-[-0.015em]">
                    {item.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => cart.remove(item.id)}
                    className="mt-0.5 text-[0.84375rem] text-teal-ink transition hover:text-teal-hover"
                  >
                    {dict.inquiry.remove}
                  </button>
                </div>

                <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-[rgba(118,118,128,0.12)] p-0.5">
                  <button
                    type="button"
                    onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                    aria-label={format(dict.inquiry.decreaseLabelTemplate, { product: item.name })}
                    className="grid size-[30px] place-items-center rounded-full text-teal-ink transition hover:bg-white/60"
                  >
                    <Minus className="size-4" strokeWidth={2.2} aria-hidden="true" />
                  </button>
                  <span className="min-w-[18px] text-center text-[0.96875rem] font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                    aria-label={format(dict.inquiry.increaseLabelTemplate, { product: item.name })}
                    className="grid size-[30px] place-items-center rounded-full text-teal-ink transition hover:bg-white/60"
                  >
                    <Plus className="size-4" strokeWidth={2.2} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}

            {cart.hydrated && cart.items.length === 0 && (
              <p className="px-3.5 py-4 text-[0.96875rem] text-muted">{dict.inquiry.listEmpty}</p>
            )}

            <Link
              href={categoryPath(locale, categories[0].slug[locale])}
              className="flex min-h-12 items-center gap-2.5 px-3.5 py-2 text-base font-medium text-teal-ink"
            >
              <Plus className="size-[18px] shrink-0" strokeWidth={2.2} aria-hidden="true" />
              {dict.inquiry.addMore}
            </Link>
          </div>
        </section>
      )}

      {isWholesale && (
        <section className="px-4 pt-5 lg:px-0">
          <h2 className="mb-2.5 text-h2 font-bold">{dict.inquiry.interestsHeading}</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const label = category.name[locale];
              const active = interests.includes(label);
              return (
                <button
                  key={category.slug.mne}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setInterests((prev) =>
                      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
                    )
                  }
                  className={clsx(
                    "h-[34px] rounded-full px-3.5 text-[0.90625rem] font-medium tracking-[-0.01em] transition",
                    active ? "bg-teal text-white" : "bg-surface text-ink shadow-card lg:bg-fill lg:shadow-none",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="px-4 pt-5 lg:px-0">
        <h2 className="mb-2.5 text-h2 font-bold">{dict.inquiry.detailsHeading}</h2>

        <div className="flex flex-col gap-2.5">
          {isWholesale && (
            <InquiryField
              label={dict.inquiry.companyLabel}
              placeholder={dict.inquiry.companyPlaceholder}
              value={values.company}
              onChange={(v) => setValue("company", v)}
              autoComplete="organization"
            />
          )}

          <InquiryField
            label={dict.inquiry.nameLabel}
            placeholder={dict.inquiry.namePlaceholder}
            value={values.name}
            onChange={(v) => setValue("name", v)}
            error={errors.name}
            autoComplete="name"
          />

          <div className="grid grid-cols-2 gap-2.5">
            <InquiryField
              label={dict.inquiry.phoneLabel}
              placeholder={dict.inquiry.phonePlaceholder}
              type="tel"
              value={values.phone}
              onChange={(v) => setValue("phone", v)}
              autoComplete="tel"
            />
            <InquiryField
              label={dict.inquiry.emailLabel}
              placeholder={dict.inquiry.emailPlaceholder}
              type="email"
              value={values.email}
              onChange={(v) => setValue("email", v)}
              error={errors.email}
              autoComplete="email"
            />
          </div>

          {isService && (
            <InquiryField
              label={dict.inquiry.toolLabel}
              placeholder={dict.inquiry.toolPlaceholder}
              value={values.tool}
              onChange={(v) => setValue("tool", v)}
            />
          )}
        </div>

        <p
          className={clsx(
            "mt-2 text-[0.84375rem]",
            errors.contact ? "font-medium text-error" : "text-muted",
          )}
        >
          {errors.contact ?? dict.inquiry.contactHint}
        </p>
      </section>

      <section className="px-4 pt-5 lg:px-0">
        <InquiryTextarea
          label={messageLabel}
          placeholder={messagePlaceholder}
          value={values.message}
          onChange={(v) => setValue("message", v)}
          error={errors.message}
        />
      </section>

      <div className="px-4 pb-7 pt-[22px] lg:px-0">
        {status === "error" && (
          <div className="mb-4">
            <FormStatusBanner
              variant="error"
              title={dict.form.errorTitle}
              body={dict.form.errorBody}
            />
          </div>
        )}
        <Button type="submit" variant="primary" size="lg" block loading={status === "submitting"}>
          {status === "submitting" ? dict.form.submitting : dict.inquiry.submit}
        </Button>
        <p className="mt-3 text-center text-[0.84375rem] leading-[1.45] text-muted">
          {dict.inquiry.responseNote}
        </p>
      </div>
    </form>
  );
}
