"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { categories } from "@/lib/taxonomy";
import { isValidEmail, submitInquiry } from "@/lib/inquiry";
import { TextField, TextareaField, CheckboxGroupField, focusFirstError } from "./fields";
import { FormStatusBanner } from "./FormStatusBanner";
import { Button } from "../ui/Button";

interface Values {
  company: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialValues: Values = { company: "", name: "", email: "", phone: "", message: "" };

export function WholesaleForm({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [values, setValues] = useState<Values>(initialValues);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function setValue(name: keyof Values, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function validate(): Partial<Record<keyof Values, string>> {
    const nextErrors: Partial<Record<keyof Values, string>> = {};
    if (!values.company.trim()) nextErrors.company = dict.form.requiredError;
    if (!values.name.trim()) nextErrors.name = dict.form.requiredError;
    if (!values.email.trim()) nextErrors.email = dict.form.requiredError;
    else if (!isValidEmail(values.email)) nextErrors.email = dict.form.emailError;
    setErrors(nextErrors);
    return nextErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors, ["company", "name", "email"] as const);
      return;
    }
    setStatus("submitting");
    try {
      await submitInquiry({
        department: "wholesale",
        locale,
        company: values.company,
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        categories: selectedCategories,
        message: values.message,
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
            setSelectedCategories([]);
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
      <TextField
        name="company"
        label={dict.form.companyLabel}
        value={values.company}
        onChange={(v) => setValue("company", v)}
        error={errors.company}
        required
        autoComplete="organization"
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
      <CheckboxGroupField
        legend={dict.form.categoriesLabel}
        options={categories.map((c) => ({ value: c.slug.mne, label: c.name[locale] }))}
        selected={selectedCategories}
        onToggle={toggleCategory}
      />
      <TextareaField
        name="message"
        label={dict.form.messageLabel}
        value={values.message}
        onChange={(v) => setValue("message", v)}
        optionalLabel={dict.form.optional}
      />
      <Button type="submit" variant="primary" size="lg" loading={status === "submitting"}>
        {status === "submitting" ? dict.form.submitting : dict.form.submit}
      </Button>
    </form>
  );
}
