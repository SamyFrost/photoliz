export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  /** CSS object-position derived from the Sanity hotspot. */
  position?: string;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  cover: Img | null;
};

export type Photo = {
  id: string;
  image: Img;
  category: string;
  title?: string;
};

export type Film = {
  id: string;
  title: string;
  url: string;
  cover: Img | null;
};

export type ServicePackage = {
  id: string;
  category: string;
  name: string;
  priceFrom: number | null;
  includes: string[];
  delivery: string;
  highlight: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  event: string;
};

export type Stat = { value: string; label: string };

export type SiteSettings = {
  heroImage: Img;
  tagline: string;
  intro: string;
  stats: Stat[];
  whatsapp: string;
  email: string;
  instagram: string;
  location: string;
};

export type About = {
  name: string;
  title: string;
  body: string[];
  portrait: Img;
  values: { title: string; text: string }[];
};
