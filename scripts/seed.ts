/**
 * Fills a fresh Sanity dataset with the starter content (categories, packages, about, settings)
 * so the Studio opens with everything in place. Safe to re-run: it only creates missing docs.
 *
 *   npx sanity login
 *   npm run seed
 */
import { getCliClient } from "sanity/cli";
import { fallback } from "../src/content/fallback";

const client = getCliClient({ apiVersion: "2026-09-01" });
const both = (es: string, en: string) => ({ _type: "localeString", es, en });

async function run() {
  const es = { cats: fallback.categories("es"), services: fallback.services("es"), about: fallback.about("es"), settings: fallback.settings("es") };
  const en = { cats: fallback.categories("en"), services: fallback.services("en"), about: fallback.about("en"), settings: fallback.settings("en") };
  const tx = client.transaction();
  // orderRank values keep the starter order in the drag-and-drop lists.
  const rank = (i: number) => `0|${String.fromCharCode(105 + i)}00000:`;

  es.cats.forEach((c, i) =>
    tx.createIfNotExists({
      _id: `category-${c.slug}`,
      _type: "category",
      orderRank: rank(i),
      title: both(c.title, en.cats[i].title),
      slug: { _type: "slug", current: c.slug },
      description: both(c.description, en.cats[i].description),
    }),
  );
  es.services.forEach((s, i) =>
    tx.createIfNotExists({
      _id: `service-${s.id}`,
      _type: "servicePackage",
      orderRank: rank(i),
      name: both(s.name, en.services[i].name),
      category: { _type: "reference", _ref: `category-${s.category}` },
      priceFrom: s.priceFrom,
      includes: { _type: "localeList", es: s.includes, en: en.services[i].includes },
      delivery: both(s.delivery, en.services[i].delivery),
      highlight: s.highlight,
      visible: true,
    }),
  );
  tx.createIfNotExists({
    _id: "about",
    _type: "about",
    title: both(es.about.title, en.about.title),
    body: es.about.body.map((p, i) => ({ _key: `p${i}`, _type: "localeText", es: p, en: en.about.body[i] })),
    values: es.about.values.map((v, i) => ({
      _key: `v${i}`,
      title: both(v.title, en.about.values[i].title),
      text: both(v.text, en.about.values[i].text),
    })),
  });
  tx.createIfNotExists({
    _id: "siteSettings",
    _type: "siteSettings",
    tagline: both(es.settings.tagline, en.settings.tagline),
    intro: { _type: "localeText", es: es.settings.intro, en: en.settings.intro },
    stats: es.settings.stats.map((s, i) => ({ _key: `s${i}`, value: s.value, label: both(s.label, en.settings.stats[i].label) })),
    whatsapp: es.settings.whatsapp,
    email: es.settings.email,
    instagram: es.settings.instagram,
    location: es.settings.location,
  });
  await tx.commit();
  console.log("Listo: contenido inicial creado en Sanity.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
