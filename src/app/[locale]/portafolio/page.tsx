import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/sections/PageHeader";
import { FinalCta } from "@/components/sections/FinalCta";
import { CategoryFilter } from "@/components/gallery/CategoryFilter";
import { Gallery } from "@/components/gallery/Gallery";
import { FilmGrid } from "@/components/gallery/FilmGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, getFilms, getPhotos, getSettings } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/portafolio">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "portfolio" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function PortfolioPage({ params }: PageProps<"/[locale]/portafolio">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, categories, photos, films, settings] = await Promise.all([
    getTranslations("portfolio"),
    getCategories(locale),
    getPhotos(locale),
    getFilms(locale),
    getSettings(locale),
  ]);

  return (
    <>
      <PageHeader eyebrow="PHOTOGRAPHY ∞ FILMS" title={t("title")} text={t("subtitle")} />
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20">
        <CategoryFilter categories={categories} />
        <div className="mt-10 md:mt-14">
          <Gallery photos={photos} />
        </div>
      </section>
      {films.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32">
          <SectionHeading eyebrow="Films" title={t("films")} />
          <div className="mt-12">
            <FilmGrid films={films} />
          </div>
        </section>
      )}
      <FinalCta settings={settings} />
    </>
  );
}
