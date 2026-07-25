import { defineArrayMember, defineField, defineType } from "sanity";

const specRow = defineArrayMember({
  name: "specRow",
  title: "Spec row",
  type: "object",
  fields: [
    defineField({ name: "label_mne", title: "Label (MNE)", type: "string" }),
    defineField({ name: "label_en", title: "Label (EN)", type: "string" }),
    defineField({ name: "value", title: "Value", type: "string" }),
  ],
  preview: {
    select: { title: "label_en", subtitle: "value" },
  },
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "specs", title: "Specs & downloads" },
  ],
  fields: [
    defineField({
      name: "title_mne",
      title: "Name (MNE)",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title_en",
      title: "Name (EN)",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title_en" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description:
        "Optional for now — real product photography hasn't been sourced yet. " +
        "The front end falls back to an illustrated placeholder until this is set.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Brand + product name, e.g. \"Bosch GSB 18V-55 cordless drill\"",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      group: "content",
      to: [{ type: "brand" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subcategorySlug",
      title: "Subcategory",
      type: "string",
      group: "content",
      description: "Must match one of the selected category's subcategory slugs.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description_mne",
      title: "Short description (MNE)",
      type: "text",
      rows: 3,
      group: "content",
      description: "1-3 sentences.",
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "description_en",
      title: "Short description (EN)",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "onSale",
      title: "On sale (homepage)",
      type: "boolean",
      group: "content",
      description: "Shows an \"on sale\" badge in the homepage Products on Sale section. No discount amount is stored — this catalog has no price data.",
      initialValue: false,
    }),
    defineField({
      name: "isNew",
      title: "New arrival (homepage)",
      type: "boolean",
      group: "content",
      description: "Shows a \"Novo\" badge in the homepage New Arrivals (\"Novo u ponudi\") section. On-sale items are excluded from that row so the two rows stay distinct.",
      initialValue: false,
    }),
    defineField({
      name: "specs",
      title: "Spec table",
      type: "array",
      group: "specs",
      of: [specRow],
      description: "Optional — leave empty to hide the spec table (never shows \"N/A\" placeholders).",
    }),
    defineField({
      name: "specPdf",
      title: "Spec sheet (PDF)",
      type: "file",
      group: "specs",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "manufacturerUrl",
      title: "Manufacturer link",
      type: "url",
      group: "specs",
    }),
  ],
  preview: {
    select: { title: "title_en", subtitle: "title_mne", media: "image" },
  },
});
