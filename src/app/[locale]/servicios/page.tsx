import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";
import { getCategories, getServices, getSettings } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/servicios">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "services" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/servicios">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, services, categories, settings] = await Promise.all([
    getTranslations("services"),
    getServices(locale),
    getCategories(locale),
    getSettings(locale),
  ]);

  // Group packages under their category, in category order; packages without one go last.
  const groups = [
    ...categories.map((c) => ({ key: c.slug, title: c.title, items: services.filter((s) => s.category === c.slug) })),
    { key: "otros", title: "", items: services.filter((s) => !categories.some((c) => c.slug === s.category)) },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader eyebrow="PHOTOGRAPHY ∞ FILMS" title={t("title")} text={t("subtitle")} />
      <div className="sticky top-[72px] z-30 border-b border-line/50 bg-night/85 backdrop-blur-xl md:top-20">
        <nav className="mx-auto max-w-[1440px] overflow-x-auto px-5 md:px-10">
          <ul className="flex gap-8 py-4">
            {groups.filter((g) => g.title).map((g) => (
              <li key={g.key}>
                <a href={`#${g.key}`} className="whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.16em] text-ink/75 transition-colors hover:text-gold-light">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        {groups.map((g, gi) => (
          <section key={g.key} id={g.key} className="scroll-mt-40 border-b border-line/40 py-12 last:border-0 md:py-16">
            {g.title && (
              <Reveal className="mb-10 flex items-baseline gap-5">
                <span className="text-[13px] text-gold-light">0{gi + 1}</span>
                <h2 className="font-display text-[26px] md:text-[36px]">{g.title}</h2>
              </Reveal>
            )}
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {g.items.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 0.08}>
                  <ServiceCard service={s} whatsapp={settings.whatsapp} />
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-8 max-w-2xl text-[14px] text-muted">{t("note")}</p>
      </div>
      <FinalCta settings={settings} />
    </>
  );
}
