// Photos already published on the site (the portfolio the photographer shared).
// Once photos exist in Sanity they take over; this list is the fallback and the seed source.
export type PortfolioPhoto = {
  file: string;
  category: string;
  featured: boolean;
  width: number;
  height: number;
  /** CSS object-position, so square crops keep the faces. */
  focus?: string;
  alt: { es: string; en: string };
};

export const PORTFOLIO: PortfolioPhoto[] = [
  { file: "boda-novios-baile", category: "bodas", featured: true, focus: "50% 28%", width: 1178, height: 1600,
    alt: { es: "Los novios bailando abrazados, ella con corona y velo", en: "The couple dancing close, she wearing a crown and veil" } },
  { file: "nina-sombrero-oveja", category: "retratos", featured: true, focus: "72% 55%", width: 1066, height: 1600,
    alt: { es: "Niña con sombrero sobre una oveja de juguete, con sus padres caminando al fondo", en: "Girl in a straw hat on a toy sheep, her parents walking in the background" } },
  { file: "nina-oso-bn", category: "retratos", featured: true, focus: "60% 45%", width: 1024, height: 1536,
    alt: { es: "Niña sonriendo y abrazando un oso de peluche gigante, en blanco y negro", en: "Girl smiling and hugging a giant teddy bear, in black and white" } },
  { file: "maternidad-lila", category: "retratos", featured: true, focus: "45% 30%", width: 1022, height: 1539,
    alt: { es: "Mujer embarazada mirando su vientre sobre fondo lila", en: "Pregnant woman looking down at her belly against a lilac backdrop" } },
  { file: "boda-novia-damas-1", category: "bodas", featured: true, focus: "50% 38%", width: 1600, height: 1032,
    alt: { es: "La novia con su ramo mientras las damas arreglan el velo junto a la ventana", en: "The bride holding her bouquet while bridesmaids adjust her veil by the window" } },
  { file: "mascota-goldendoodle", category: "retratos", featured: true, focus: "50% 22%", width: 1024, height: 1536,
    alt: { es: "Goldendoodle con corbatín sentado en una silla con luz cálida y azul", en: "Goldendoodle in a bow tie seated on a chair in warm and blue light" } },
  { file: "familia-pastel-1", category: "eventos", featured: true, focus: "50% 55%", width: 1024, height: 1600,
    alt: { es: "Familia celebrando un cumpleaños con un pastel decorado con flores", en: "Family celebrating a birthday with a flower-topped cake" } },
  { file: "boda-novia-damas-2", category: "bodas", featured: false, width: 1600, height: 1093,
    alt: { es: "La novia rodeada de sus damas de honor con luz de ventana", en: "The bride surrounded by her bridesmaids in window light" } },
  { file: "nina-sonriente", category: "retratos", featured: false, width: 1024, height: 1536,
    alt: { es: "Retrato de una niña sonriente con lazos blancos", en: "Portrait of a smiling girl with white ribbons" } },
  { file: "nina-abrazo-papa", category: "retratos", featured: false, width: 1067, height: 1600,
    alt: { es: "Niña con vestido blanco abrazada a la pierna de su papá en el parque", en: "Girl in a white dress hugging her dad's leg in the park" } },
  { file: "papa-hija-brazos", category: "retratos", featured: false, width: 1018, height: 1600,
    alt: { es: "Papá levantando a su hija entre los árboles", en: "Dad lifting his daughter among the trees" } },
  { file: "nina-canasta-flores", category: "retratos", featured: false, width: 1066, height: 1600,
    alt: { es: "Niña con vestido de encaje y una canasta de flores bajo un roble", en: "Girl in a lace dress with a basket of flowers under an oak tree" } },
  { file: "familia-pastel-2", category: "eventos", featured: false, width: 1066, height: 1600,
    alt: { es: "Familia sentada en el pasto junto al pastel de cumpleaños", en: "Family sitting on the grass beside the birthday cake" } },
];
