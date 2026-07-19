import { defineField, defineType } from "sanity";

export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "e.g. \"Bosch logo\"",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description_mne",
      title: "Description (MNE)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description_en",
      title: "Description (EN)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "website",
      title: "Manufacturer website",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
