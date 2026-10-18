import type { Locale } from "@/i18n/routing";
import type { About, Category, Film, Photo, ServicePackage, SiteSettings, Testimonial } from "@/lib/types";
import { asset, SITE } from "../lib/site";
import { PORTFOLIO } from "./portfolio"; // relative so `npm run seed` resolves it too

/**
 * Content shown until the Sanity project is connected (or while a type has no documents).
 * Prices are starting points to review with Liz; testimonials stay empty on purpose so the
 * site never shows reviews nobody wrote.
 */
type L = Record<Locale, string>;
const t = (l: L, locale: Locale) => l[locale];

const heroImage = {
  src: asset("/images/liz-hero.webp"),
  alt: "",
  width: 1100,
  height: 1458,
};
const portrait = {
  src: asset("/images/liz-retrato.webp"),
  alt: "",
  width: 1200,
  height: 1600,
};

const categories: { slug: string; title: L; description: L }[] = [
  {
    slug: "retratos",
    title: { es: "Retratos", en: "Portraits" },
    description: { es: "Sesiones personales, en pareja o en familia.", en: "Personal, couple and family sessions." },
  },
  {
    slug: "bodas",
    title: { es: "Bodas", en: "Weddings" },
    description: { es: "Tu día contado de principio a fin.", en: "Your day, told from start to finish." },
  },
  {
    slug: "quinceaneras",
    title: { es: "Quinceañeras", en: "Quinceañeras" },
    description: { es: "Quince años que se quedan para siempre.", en: "Fifteen, kept forever." },
  },
  {
    slug: "eventos",
    title: { es: "Eventos", en: "Events" },
    description: { es: "Cumpleaños, baby showers y celebraciones.", en: "Birthdays, baby showers and celebrations." },
  },
  {
    slug: "marcas",
    title: { es: "Marcas y producto", en: "Brands & product" },
    description: { es: "Fotos de producto y contenido para redes.", en: "Product photos and social content." },
  },
  {
    slug: "films",
    title: { es: "Films", en: "Films" },
    description: { es: "Videos y reels con la misma luz.", en: "Videos and reels in the same light." },
  },
];

const services: (Omit<ServicePackage, "name" | "includes" | "delivery"> & {
  name: L;
  includes: Record<Locale, string[]>;
  delivery: L;
})[] = [
  {
    id: "retrato",
    category: "retratos",
    name: { es: "Sesión de retrato", en: "Portrait session" },
    priceFrom: 150,
    includes: {
      es: ["1 hora de sesión", "1 locación", "20 fotos editadas", "Galería online privada"],
      en: ["1-hour session", "1 location", "20 edited photos", "Private online gallery"],
    },
    delivery: { es: "Entrega en 7 días", en: "Delivered in 7 days" },
    highlight: false,
  },
  {
    id: "familia",
    category: "retratos",
    name: { es: "Pareja o familia", en: "Couple or family" },
    priceFrom: 220,
    includes: {
      es: ["1,5 horas de sesión", "Hasta 6 personas", "35 fotos editadas", "Galería online privada"],
      en: ["1.5-hour session", "Up to 6 people", "35 edited photos", "Private online gallery"],
    },
    delivery: { es: "Entrega en 10 días", en: "Delivered in 10 days" },
    highlight: true,
  },
  {
    id: "quince",
    category: "quinceaneras",
    name: { es: "Quinceañera", en: "Quinceañera" },
    priceFrom: 650,
    includes: {
      es: ["Sesión previa", "Cobertura de la fiesta", "Fotos editadas ilimitadas", "Opción de film"],
      en: ["Pre-event session", "Party coverage", "Unlimited edited photos", "Film add-on"],
    },
    delivery: { es: "Entrega en 3 semanas", en: "Delivered in 3 weeks" },
    highlight: false,
  },
  {
    id: "boda",
    category: "bodas",
    name: { es: "Boda", en: "Wedding" },
    priceFrom: 1200,
    includes: {
      es: ["Preparativos, ceremonia y fiesta", "Foto y video", "Galería completa", "Film resumen"],
      en: ["Getting ready, ceremony and party", "Photo and video", "Full gallery", "Highlight film"],
    },
    delivery: { es: "Entrega en 4 semanas", en: "Delivered in 4 weeks" },
    highlight: true,
  },
  {
    id: "evento",
    category: "eventos",
    name: { es: "Evento social", en: "Social event" },
    priceFrom: 300,
    includes: {
      es: ["2 horas de cobertura", "Fotos editadas", "Galería online privada"],
      en: ["2 hours of coverage", "Edited photos", "Private online gallery"],
    },
    delivery: { es: "Entrega en 10 días", en: "Delivered in 10 days" },
    highlight: false,
  },
  {
    id: "producto",
    category: "marcas",
    name: { es: "Producto y marca", en: "Product & brand" },
    priceFrom: 180,
    includes: {
      es: ["Hasta 10 productos", "Fondo limpio o ambientado", "Fotos listas para redes y tienda"],
      en: ["Up to 10 products", "Clean or styled background", "Photos ready for social and shop"],
    },
    delivery: { es: "Entrega en 7 días", en: "Delivered in 7 days" },
    highlight: false,
  },
  {
    id: "reel",
    category: "films",
    name: { es: "Reel o film corto", en: "Reel or short film" },
    priceFrom: 250,
    includes: {
      es: ["Grabación de hasta 2 horas", "Edición con música", "Formato vertical y horizontal"],
      en: ["Up to 2 hours of filming", "Edit with music", "Vertical and horizontal formats"],
    },
    delivery: { es: "Entrega en 10 días", en: "Delivered in 10 days" },
    highlight: false,
  },
];

export const fallback = {
  settings(locale: Locale): SiteSettings {
    return {
      heroImage: { ...heroImage, alt: t({ es: "La fotógrafa de PHOLIZ con su cámara", en: "The PHOLIZ photographer with her camera" }, locale) },
      tagline: t({ es: "Tu historia, en luz.", en: "Your story, in light." }, locale),
      intro: t(
        {
          es: "Fotografía y video con un mismo estilo: retratos, eventos, bodas, contenido para marcas y films, con luz limpia y un acabado elegante.",
          en: "Photography and film in one style: portraits, events, weddings, brand content and films, with clean light and an elegant finish.",
        },
        locale,
      ),
      stats: [
        { value: "Foto ∞ Film", label: t({ es: "Un mismo estilo", en: "One style" }, locale) },
        { value: "ES · EN", label: t({ es: "Atención bilingüe", en: "Bilingual service" }, locale) },
        { value: "Tampa", label: t({ es: "y alrededores, FL", en: "and surroundings, FL" }, locale) },
      ],
      whatsapp: SITE.whatsapp,
      email: SITE.email,
      instagram: SITE.instagram,
      location: SITE.location,
    };
  },
  categories(locale: Locale): Category[] {
    return categories.map((c) => ({ slug: c.slug, title: t(c.title, locale), description: t(c.description, locale), cover: null }));
  },
  photos(locale: Locale): Photo[] {
    return PORTFOLIO.map((p) => ({
      id: p.file,
      category: p.category,
      featured: p.featured,
      image: { src: asset(`/images/portfolio/${p.file}.webp`), alt: p.alt[locale], width: p.width, height: p.height, position: p.focus },
    }));
  },
  films(): Film[] {
    return [];
  },
  services(locale: Locale): ServicePackage[] {
    return services.map((s) => ({ ...s, name: t(s.name, locale), includes: s.includes[locale], delivery: t(s.delivery, locale) }));
  },
  testimonials(): Testimonial[] {
    return [];
  },
  about(locale: Locale): About {
    return {
      name: "",
      title: t({ es: "Detrás de la cámara", en: "Behind the camera" }, locale),
      body: {
        es: [
          "PHOLIZ nace de una idea simple: guardar los momentos y las historias de las personas con imágenes que se sientan verdaderas, hoy y dentro de muchos años.",
          "Trabajo con luz natural, encuadres serenos y una dirección suave, para que te sientas tú frente a la cámara. Retrato, eventos, bodas, marcas y films, todo con un mismo estilo.",
        ],
        en: [
          "PHOLIZ was born from a simple idea: to keep people's moments and stories in images that feel true, today and many years from now.",
          "I work with natural light, calm framing and gentle direction, so you feel like yourself in front of the camera. Portraits, events, weddings, brands and films, all in one style.",
        ],
      }[locale],
      portrait: { ...portrait, alt: t({ es: "Retrato de la fotógrafa de PHOLIZ", en: "Portrait of the PHOLIZ photographer" }, locale) },
      values: [
        {
          title: t({ es: "Luz cuidada", en: "Careful light" }, locale),
          text: t({ es: "Luz y encuadre cuidados en cada toma.", en: "Light and framing cared for in every shot." }, locale),
        },
        {
          title: t({ es: "Trato cercano", en: "Close care" }, locale),
          text: t({ es: "Antes, durante y después de la sesión.", en: "Before, during and after the session." }, locale),
        },
        {
          title: t({ es: "Foto ∞ Film", en: "Photo ∞ Film" }, locale),
          text: t({ es: "Fotografía y video con un mismo estilo.", en: "Photography and video in one style." }, locale),
        },
      ],
    };
  },
};
