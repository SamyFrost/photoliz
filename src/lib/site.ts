/** Fixed brand facts (from the PhoLiz brand kit). Editable copies live in Sanity's siteSettings. */
export const SITE = {
  name: "PHOLIZ",
  descriptor: "PHOTOGRAPHY ∞ FILMS",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pholiz.com",
  whatsapp: "+19049820459",
  email: "crreaclary02@gmail.com",
  instagram: "pho_toliz",
  location: "Tampa, FL",
};

export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function instagramLink(handle: string) {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}
