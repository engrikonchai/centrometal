"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { isValidEmail, submitInquiry } from "@/lib/inquiry";
import { TextField, TextareaField, focusFirstError } from "./fields";
import { FormStatusBanner } from "./FormStatusBanner";
import { Button } from "../ui/Button";

interface Values {
  name: string;
  email: string;
  phone: string;
  brand: string;
  issue: string;
}

const initialValues: Values = { name: "", email: "", phone: "", brand: "", issue: "" };

export function ServiceForm({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function setValue(name: keyof Values, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate(): Partial<Record<keyof Values, string>> {
    const nextErrors: Partial<Record<keyof Values, string>> = {};
    if (!values.name.trim()) nextErrors.name = dict.form.requiredError;
    if (!values.email.trim()) nextErrors.email = dict.form.requiredError;
    else if (!isValidEmail(values.email)) nextErrors.email = dict.form.emailError;
    if (!values.issue.trim()) nextErrors.issue = dict.form.requiredError;
    setErrors(nextErrors);
    return nextErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors, ["name", "email", "issue"] as const);
      return;
    }
    setStatus("submitting");
    try {
      await submitInquiry({
        department: "service",
        locale,
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        brand: values.brand || undefined,
        message: values.issue,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

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
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="phone"
          type="tel"
          label={dict.form.phoneLabel}
          value={values.phone}
          onChange={(v) => setValue("phone", v)}
          optionalLabel={dict.form.optional}
          autoComplete="tel"
        />
        <TextField
          name="brand"
          label={dict.form.brandLabel}
          value={values.brand}
          onChange={(v) => setValue("brand", v)}
        />
      </div>
      <TextareaField
        name="issue"
        label={dict.form.issueLabel}
        value={values.issue}
        onChange={(v) => setValue("issue", v)}
        error={errors.issue}
        required
      />
      <Button type="submit" variant="primary" size="lg" loading={status === "submitting"}>
        {status === "submitting" ? dict.form.submitting : dict.form.submit}
      </Button>
    </form>
  );
}
