/** Fixed brand facts (from the PhoLiz brand kit). Editable copies live in Sanity's siteSettings. */
export const SITE = {
  name: "PHOLIZ",
  owner: "Clara Liz Correa",
  descriptor: "PHOTOGRAPHY ∞ FILMS",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pholiz.com",
  whatsapp: "+19049820459",
  email: "crreaclary02@gmail.com",
  instagram: "pho_toliz",
  location: "Tampa, FL",
};

/** True when building the static copy for GitHub Pages (no server: no API routes, no proxy). */
export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/** Prefixes a file in /public with the base path the site is served under (e.g. /photoliz on Pages). */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function instagramLink(handle: string) {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}
