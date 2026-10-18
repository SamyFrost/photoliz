import { localeList, localeString, localeText, photoImage } from "./locale";
import { about, category, film, photo, servicePackage, siteSettings, testimonial } from "./documents";

export const schemaTypes = [
  localeString,
  localeText,
  localeList,
  photoImage,
  siteSettings,
  about,
  category,
  photo,
  film,
  servicePackage,
  testimonial,
];

/** Documents that exist once; the Studio opens them directly instead of as a list. */
export const singletons = ["siteSettings", "about"];
