import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";
import { getCategories } from "@/lib/content";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics: AppPathname[] = ["/", "/portafolio", "/servicios", "/sobre-mi", "/contacto"];
  const categories = await getCategories("es");
  type Href = Parameters<typeof getPathname>[0]["href"];
  const hrefs: Href[] = [
    ...(statics as Href[]),
    ...categories.map((c) => ({ pathname: "/portafolio/[categoria]" as const, params: { categoria: c.slug } })),
  ];
  return hrefs.map((href) => ({
    url: SITE.url + getPathname({ locale: "es", href }),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((locale) => [locale, SITE.url + getPathname({ locale, href })])),
    },
  }));
}
