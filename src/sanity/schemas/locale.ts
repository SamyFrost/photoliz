import { defineField, defineType } from "sanity";

/** A short text in both languages. Spanish is required; English falls back to Spanish when empty. */
export const localeString = defineType({
  name: "localeString",
  title: "Texto ES / EN",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "string", validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Párrafo ES / EN",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
  ],
});

export const localeList = defineType({
  name: "localeList",
  title: "Lista ES / EN",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "en", title: "English", type: "array", of: [{ type: "string" }] }),
  ],
});

/** Image with hotspot and a bilingual description for screen readers and Google. */
export const photoImage = defineType({
  name: "photoImage",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Descripción de la foto (ES / EN)", type: "localeString" })],
});
