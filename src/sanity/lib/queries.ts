import { defineQuery } from "next-sanity";

// `$locale` picks the language; English falls back to Spanish when it's empty.
const t = (field: string) => `coalesce(${field}[$locale], ${field}.es)`;
const img = (field: string) => `${field}{
  "src": asset->url,
  "alt": ${t("alt")},
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "blurDataURL": asset->metadata.lqip,
  hotspot
}`;

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  ${img("heroImage")},
  "tagline": ${t("tagline")},
  "intro": ${t("intro")},
  "stats": stats[]{ value, "label": ${t("label")} },
  whatsapp, email, instagram, location
}`);

export const categoriesQuery = defineQuery(`*[_type == "category"] | order(orderRank){
  "slug": slug.current,
  "title": ${t("title")},
  "description": ${t("description")},
  ${img("cover")}
}`);

export const photosQuery = defineQuery(`*[_type == "photo" && defined(image.asset)
  && (!defined($category) || category->slug.current == $category)
  && (!$featured || featured == true)] | order(orderRank){
  "id": _id,
  ${img("image")},
  "category": category->slug.current,
  "title": ${t("title")}
}`);

export const filmsQuery = defineQuery(`*[_type == "film"] | order(orderRank){
  "id": _id, "title": ${t("title")}, url, ${img("cover")}
}`);

export const servicesQuery = defineQuery(`*[_type == "servicePackage" && visible != false] | order(orderRank){
  "id": _id,
  "category": category->slug.current,
  "name": ${t("name")},
  priceFrom,
  "includes": coalesce(includes[$locale], includes.es, []),
  "delivery": ${t("delivery")},
  "highlight": coalesce(highlight, false)
}`);

export const testimonialsQuery = defineQuery(`*[_type == "testimonial"] | order(orderRank){
  "id": _id, "quote": ${t("quote")}, author, "event": ${t("event")}
}`);

export const aboutQuery = defineQuery(`*[_id == "about"][0]{
  name,
  "title": ${t("title")},
  "body": body[]{ "p": coalesce(@[$locale], es) }[].p,
  ${img("portrait")},
  "values": values[]{ "title": ${t("title")}, "text": ${t("text")} }
}`);
