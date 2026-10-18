import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { CategoryFilter } from "@/components/gallery/CategoryFilter";
import { Gallery } from "@/components/gallery/Gallery";
import { FilmGrid } from "@/components/gallery/FilmGrid";
import { getCategories, getFilms, getPhotos, getSettings } from "@/lib/content";

type Props = PageProps<"/[locale]/portafolio/[categoria]">;

export async function generateStaticParams() {
  const all = await Promise.all(
    routing.locales.map(async (locale) => (await getCategories(locale)).map((c) => ({ locale, categoria: c.slug }))),
  );
  return all.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categoria } = await params;
  const cat = (await getCategories(locale as Locale)).find((c) => c.slug === categoria);
  return cat ? { title: cat.title, description: cat.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  const { locale: l, categoria } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const [t, categories, photos, settings] = await Promise.all([
    getTranslations("portfolio"),
    getCategories(locale),
    getPhotos(locale, { category: categoria }),
    getSettings(locale),
  ]);
  const category = categories.find((c) => c.slug === categoria);
  if (!category) notFound();
  const films = categoria === "films" ? await getFilms(locale) : [];

  return (
    <>
      <PageHeader eyebrow={t("title")} title={category.title} text={category.description} />
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20">
        <CategoryFilter categories={categories} active={categoria} />
        {films.length > 0 && (
          <div className="mt-10 md:mt-14">
            <FilmGrid films={films} />
          </div>
        )}
        {(films.length === 0 || photos.length > 0) && (
          <div className="mt-10 md:mt-14">
            <Gallery photos={photos} />
          </div>
        )}
      </section>
      <FinalCta settings={settings} />
    </>
  );
}
