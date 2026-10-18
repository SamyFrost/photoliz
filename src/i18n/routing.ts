import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/portafolio": { es: "/portafolio", en: "/portfolio" },
    "/portafolio/[categoria]": { es: "/portafolio/[categoria]", en: "/portfolio/[categoria]" },
    "/servicios": { es: "/servicios", en: "/services" },
    "/sobre-mi": { es: "/sobre-mi", en: "/about" },
    "/contacto": { es: "/contacto", en: "/contact" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
/** Routes without dynamic segments (usable as a plain `href`). */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;
