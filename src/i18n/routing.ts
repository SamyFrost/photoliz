import { defineRouting } from "next-intl/routing";

// The GitHub Pages copy has no proxy to rewrite translated URLs, so there every path keeps its
// Spanish name and always carries the language prefix (/es/…, /en/…).
const STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const t = <T extends string>(es: T, en: string) => (STATIC ? es : { es, en });

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: STATIC ? "always" : "as-needed",
  pathnames: {
    "/": "/",
    "/portafolio": t("/portafolio", "/portfolio"),
    "/portafolio/[categoria]": t("/portafolio/[categoria]", "/portfolio/[categoria]"),
    "/servicios": t("/servicios", "/services"),
    "/sobre-mi": t("/sobre-mi", "/about"),
    "/contacto": t("/contacto", "/contact"),
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
/** Routes without dynamic segments (usable as a plain `href`). */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;
