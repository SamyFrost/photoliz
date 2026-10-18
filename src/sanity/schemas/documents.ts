import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";


export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Foto de portada (idealmente PNG sin fondo)", type: "photoImage" }),
    defineField({ name: "tagline", title: "Frase principal", type: "localeString" }),
    defineField({ name: "intro", title: "Texto de presentación", type: "localeText" }),
    defineField({
      name: "stats",
      title: "Cifras (ej. 120+ sesiones)",
      type: "array",
      validation: (r) => r.max(4),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Número o dato", type: "string" }),
            defineField({ name: "label", title: "Etiqueta", type: "localeString" }),
          ],
          preview: { select: { title: "value", subtitle: "label.es" } },
        },
      ],
    }),
    defineField({ name: "whatsapp", title: "WhatsApp (con código de país)", type: "string" }),
    defineField({ name: "email", title: "Correo", type: "string" }),
    defineField({ name: "instagram", title: "Instagram (sin @)", type: "string" }),
    defineField({ name: "location", title: "Ubicación", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Ajustes del sitio" }) },
});

export const category = defineType({
  name: "category",
  title: "Categorías",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "category" }),
    defineField({ name: "title", title: "Nombre", type: "localeString" }),
    defineField({
      name: "slug",
      title: "Dirección (URL)",
      type: "slug",
      options: { source: "title.es" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Descripción corta", type: "localeString" }),
    defineField({ name: "cover", title: "Portada", type: "photoImage" }),
  ],
  preview: { select: { title: "title.es", media: "cover" } },
});

export const photo = defineType({
  name: "photo",
  title: "Fotos",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "photo" }),
    defineField({ name: "image", title: "Foto", type: "photoImage", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Título (opcional)", type: "localeString" }),
    defineField({
      name: "featured",
      title: "Destacar en el inicio",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title.es", subtitle: "category.title.es", media: "image", featured: "featured" },
    prepare: ({ title, subtitle, media, featured }) => ({
      title: title || "Foto",
      subtitle: `${subtitle ?? "Sin categoría"}${featured ? " · ★ inicio" : ""}`,
      media,
    }),
  },
});

export const film = defineType({
  name: "film",
  title: "Films",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "film" }),
    defineField({ name: "title", title: "Título", type: "localeString" }),
    defineField({
      name: "url",
      title: "Link de YouTube o Vimeo",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({ name: "cover", title: "Portada", type: "photoImage" }),
  ],
  preview: { select: { title: "title.es", subtitle: "url", media: "cover" } },
});

export const servicePackage = defineType({
  name: "servicePackage",
  title: "Servicios y paquetes",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "servicePackage" }),
    defineField({ name: "name", title: "Nombre del paquete", type: "localeString" }),
    defineField({ name: "category", title: "Categoría", type: "reference", to: [{ type: "category" }] }),
    defineField({
      name: "priceFrom",
      title: "Precio desde (USD). Vacío = «Consultar»",
      type: "number",
      validation: (r) => r.min(0),
    }),
    defineField({ name: "includes", title: "Qué incluye", type: "localeList" }),
    defineField({ name: "delivery", title: "Tiempo de entrega", type: "localeString" }),
    defineField({ name: "highlight", title: "Marcar como favorito", type: "boolean", initialValue: false }),
    defineField({ name: "visible", title: "Visible en el sitio", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "name.es", price: "priceFrom", visible: "visible" },
    prepare: ({ title, price, visible }) => ({
      title,
      subtitle: `${price ? `Desde $${price}` : "Consultar"}${visible === false ? " · oculto" : ""}`,
    }),
  },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonios",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "testimonial" }),
    defineField({ name: "quote", title: "Lo que dijo", type: "localeText" }),
    defineField({ name: "author", title: "Nombre del cliente", type: "string" }),
    defineField({ name: "event", title: "Tipo de sesión o evento", type: "localeString" }),
  ],
  preview: { select: { title: "author", subtitle: "event.es" } },
});

export const about = defineType({
  name: "about",
  title: "Sobre mí",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tu nombre", type: "string" }),
    defineField({ name: "title", title: "Título", type: "localeString" }),
    defineField({ name: "body", title: "Tu historia (un párrafo por bloque)", type: "array", of: [{ type: "localeText" }] }),
    defineField({ name: "portrait", title: "Tu foto", type: "photoImage" }),
    defineField({
      name: "values",
      title: "Valores",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Valor", type: "localeString" }),
            defineField({ name: "text", title: "Explicación", type: "localeString" }),
          ],
          preview: { select: { title: "title.es" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Sobre mí" }) },
});

