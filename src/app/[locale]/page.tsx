import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { Marquee } from "@/components/sections/Marquee";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";
import { FeaturedMosaic } from "@/components/gallery/FeaturedMosaic";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAbout, getCategories, getPhotos, getServices, getSettings, getTestimonials } from "@/lib/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, settings, categories, featured, photos, services, about, testimonials] = await Promise.all([
    getTranslations("home"),
    getSettings(locale),
    getCategories(locale),
    getPhotos(locale, { featured: true }),
    getPhotos(locale),
    getServices(locale),
    getAbout(locale),
    getTestimonials(locale),
  ]);
  const picks = [...services.filter((s) => s.highlight), ...services.filter((s) => !s.highlight)].slice(0, 3);

  return (
    <>
      <Hero settings={settings} />
      <Stats stats={settings.stats} />

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading index="01" eyebrow={t("portfolioEyebrow")} title={t("portfolioTitle")} />
          <Reveal>
            <ButtonLink href="/portafolio" variant="ghost" className="!px-0">
              {t("portfolioCta")}
            </ButtonLink>
          </Reveal>
        </div>
        <div className="mt-14">
          <CategoryGrid categories={categories} photos={photos} />
        </div>
        {featured.length > 0 && (
          <div className="mt-5">
            <FeaturedMosaic photos={featured.slice(0, 7)} />
          </div>
        )}
      </section>

      <Marquee word={t("marquee")} />

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <SectionHeading index="02" eyebrow={t("servicesEyebrow")} title={t("servicesTitle")} text={t("servicesText")} />
            <Reveal delay={0.1} className="mt-10">
              <ButtonLink href="/servicios" variant="outline">
                {t("servicesCta")}
              </ButtonLink>
            </Reveal>
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {picks.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 0.08}>
                <ServiceCard service={s} whatsapp={settings.whatsapp} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line/50 bg-deep/50">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
          <AboutPreview about={about} />
        </div>
      </section>

      <Testimonials items={testimonials} />
      <FinalCta settings={settings} />
    </>
  );
}
