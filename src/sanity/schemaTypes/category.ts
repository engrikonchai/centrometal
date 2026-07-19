import { defineArrayMember, defineField, defineType } from "sanity";

const subcategory = defineArrayMember({
  name: "subcategory",
  title: "Subcategory",
  type: "object",
  fields: [
    defineField({ name: "name_mne", title: "Name (MNE)", type: "string" }),
    defineField({ name: "name_en", title: "Name (EN)", type: "string" }),
    defineField({
      name: "slug_mne",
      title: "Slug (MNE)",
      type: "slug",
      options: { source: "name_mne" },
    }),
    defineField({
      name: "slug_en",
      title: "Slug (EN)",
      type: "slug",
      options: { source: "name_en" },
    }),
  ],
  preview: {
    select: { title: "name_mne", subtitle: "name_en" },
  },
});

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name_mne",
      title: "Name (MNE)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name_en",
      title: "Name (EN)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug_mne",
      title: "Slug (MNE)",
      type: "slug",
      options: { source: "name_mne" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug_en",
      title: "Slug (EN)",
      type: "slug",
      options: { source: "name_en" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro_mne",
      title: "SEO intro (MNE)",
      type: "text",
      rows: 2,
      description: "One short sentence shown under the category H1.",
    }),
    defineField({
      name: "intro_en",
      title: "SEO intro (EN)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "orderRank",
      title: "Display order",
      type: "number",
    }),
    defineField({
      name: "subcategories",
      title: "Subcategories",
      type: "array",
      of: [subcategory],
    }),
  ],
  preview: {
    select: { title: "name_mne", subtitle: "name_en" },
  },
});
