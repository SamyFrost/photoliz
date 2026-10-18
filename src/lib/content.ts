import "server-only";
import { cache } from "react";
import type { Locale } from "@/i18n/routing";
import { fallback } from "@/content/fallback";
import { sanityFetch } from "@/sanity/lib/client";
import {
  aboutQuery,
  categoriesQuery,
  filmsQuery,
  photosQuery,
  servicesQuery,
  settingsQuery,
  testimonialsQuery,
} from "@/sanity/lib/queries";
import type { About, Category, Film, Img, Photo, ServicePackage, SiteSettings, Testimonial } from "./types";

type RawImg = (Omit<Img, "position"> & { hotspot?: { x: number; y: number } | null }) | null | undefined;

function toImg(raw: RawImg, fallbackAlt = ""): Img | null {
  if (!raw?.src) return null;
  const { hotspot, ...rest } = raw;
  return {
    ...rest,
    alt: rest.alt || fallbackAlt,
    position: hotspot ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%` : undefined,
  };
}

/** Use Sanity's list when it has documents; otherwise the built-in content. */
function listOr<T>(list: T[] | null, fb: T[]) {
  return list && list.length > 0 ? list : fb;
}

export const getSettings = cache(async (locale: Locale): Promise<SiteSettings> => {
  const fb = fallback.settings(locale);
  const raw = await sanityFetch<Partial<Omit<SiteSettings, "heroImage">> & { heroImage: RawImg }>(settingsQuery, { locale });
  if (!raw) return fb;
  return {
    heroImage: toImg(raw.heroImage, fb.heroImage.alt) ?? fb.heroImage,
    tagline: raw.tagline || fb.tagline,
    intro: raw.intro || fb.intro,
    stats: raw.stats?.length ? raw.stats : fb.stats,
    whatsapp: raw.whatsapp || fb.whatsapp,
    email: raw.email || fb.email,
    instagram: raw.instagram || fb.instagram,
    location: raw.location || fb.location,
  };
});

export const getCategories = cache(async (locale: Locale): Promise<Category[]> => {
  const raw = await sanityFetch<(Omit<Category, "cover"> & { cover: RawImg })[]>(categoriesQuery, { locale });
  return listOr(
    raw?.filter((c) => c.slug).map((c) => ({ ...c, cover: toImg(c.cover, c.title) })) ?? null,
    fallback.categories(locale),
  );
});

export const getPhotos = cache(
  async (locale: Locale, opts: { category?: string; featured?: boolean } = {}): Promise<Photo[]> => {
    const raw = await sanityFetch<(Omit<Photo, "image"> & { image: RawImg })[]>(photosQuery, {
      locale,
      category: opts.category ?? null,
      featured: opts.featured ?? false,
    });
    const photos = (raw ?? []).flatMap((p) => {
      const image = toImg(p.image, p.title ?? "PHOLIZ");
      return image ? [{ ...p, image }] : [];
    });
    return listOr(photos, fallback.photos());
  },
);

export const getFilms = cache(async (locale: Locale): Promise<Film[]> => {
  const raw = await sanityFetch<(Omit<Film, "cover"> & { cover: RawImg })[]>(filmsQuery, { locale });
  return listOr(raw?.map((f) => ({ ...f, cover: toImg(f.cover, f.title) })) ?? null, fallback.films());
});

export const getServices = cache(async (locale: Locale): Promise<ServicePackage[]> => {
  const raw = await sanityFetch<ServicePackage[]>(servicesQuery, { locale });
  return listOr(raw, fallback.services(locale));
});

export const getTestimonials = cache(async (locale: Locale): Promise<Testimonial[]> => {
  const raw = await sanityFetch<Testimonial[]>(testimonialsQuery, { locale });
  return listOr(raw, fallback.testimonials());
});

export const getAbout = cache(async (locale: Locale): Promise<About> => {
  const fb = fallback.about(locale);
  const raw = await sanityFetch<Partial<Omit<About, "portrait">> & { portrait: RawImg }>(aboutQuery, { locale });
  if (!raw) return fb;
  return {
    name: raw.name || fb.name,
    title: raw.title || fb.title,
    body: raw.body?.filter(Boolean).length ? raw.body.filter(Boolean) : fb.body,
    portrait: toImg(raw.portrait, fb.portrait.alt) ?? fb.portrait,
    values: raw.values?.length ? raw.values : fb.values,
  };
});
