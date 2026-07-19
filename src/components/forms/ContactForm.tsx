"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { isValidEmail, submitInquiry, type Department } from "@/lib/inquiry";
import { TextField, TextareaField, SelectField, focusFirstError } from "./fields";
import { FormStatusBanner } from "./FormStatusBanner";
import { Button } from "../ui/Button";

interface Values {
  department: Department;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialValues: Values = {
  department: "retail",
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const searchParams = useSearchParams();
  const quoteProduct = searchParams.get("product");
  const [values, setValues] = useState<Values>(() =>
    quoteProduct
      ? { ...initialValues, message: dict.product.quotePrefillTemplate.replace("{product}", quoteProduct) }
      : initialValues,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function setValue<K extends keyof Values>(name: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate(): Partial<Record<keyof Values, string>> {
    const nextErrors: Partial<Record<keyof Values, string>> = {};
    if (!values.name.trim()) nextErrors.name = dict.form.requiredError;
    if (!values.email.trim()) nextErrors.email = dict.form.requiredError;
    else if (!isValidEmail(values.email)) nextErrors.email = dict.form.emailError;
    if (!values.message.trim()) nextErrors.message = dict.form.requiredError;
    setErrors(nextErrors);
    return nextErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors, ["name", "email", "message"] as const);
      return;
    }
    setStatus("submitting");
    try {
      await submitInquiry({
        department: values.department,
        locale,
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        message: values.message,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const departmentOptions: { value: Department; label: string }[] = [
    { value: "retail", label: dict.contactPage.departmentRetail },
    { value: "wholesale", label: dict.contactPage.departmentWholesale },
    { value: "service", label: dict.contactPage.departmentService },
  ];

  if (status === "success") {
    return (
      <div className="space-y-4">
        <FormStatusBanner variant="success" title={dict.form.successTitle} body={dict.form.successBody} />
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            setValues(initialValues);
            setStatus("idle");
          }}
        >
          {dict.form.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === "error" && (
        <FormStatusBanner variant="error" title={dict.form.errorTitle} body={dict.form.errorBody} />
      )}
      <SelectField
        name="department"
        label={dict.form.departmentLabel}
        value={values.department}
        onChange={(v) => setValue("department", v as Department)}
        options={departmentOptions}
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="name"
          label={dict.form.nameLabel}
          value={values.name}
          onChange={(v) => setValue("name", v)}
          error={errors.name}
          required
          autoComplete="name"
        />
        <TextField
          name="email"
          type="email"
          label={dict.form.emailLabel}
          value={values.email}
          onChange={(v) => setValue("email", v)}
          error={errors.email}
          required
          autoComplete="email"
        />
      </div>
      <TextField
        name="phone"
        type="tel"
        label={dict.form.phoneLabel}
        value={values.phone}
        onChange={(v) => setValue("phone", v)}
        optionalLabel={dict.form.optional}
        autoComplete="tel"
      />
      <TextareaField
        name="message"
        label={dict.form.messageLabel}
        value={values.message}
        onChange={(v) => setValue("message", v)}
        error={errors.message}
        required
      />
      <Button type="submit" variant="primary" size="lg" loading={status === "submitting"}>
        {status === "submitting" ? dict.form.submitting : dict.form.submit}
      </Button>
    </form>
  );
}
