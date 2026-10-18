import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { FinalCta } from "@/components/sections/FinalCta";
import { Mark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CameraIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { GoldRule, MaskReveal, Reveal } from "@/components/ui/Reveal";
import { getAbout, getSettings } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/sobre-mi">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/sobre-mi">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, about, settings] = await Promise.all([getTranslations("about"), getAbout(locale), getSettings(locale)]);

  return (
    <>
      <section className="grain relative overflow-hidden bg-night pb-20 pt-32 md:pb-32 md:pt-44">
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -left-4 top-24 select-none text-[28vw] leading-none text-surface-alt/60 md:top-28 md:text-[16vw]"
        >
          {t("hello")}
        </span>
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-5 md:grid-cols-[1fr_1.1fr] md:gap-20 md:px-10">
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <MaskReveal className="aspect-[4/5] rounded-[6px]">
              <Photo image={about.portrait} fill priority sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
            </MaskReveal>
            <span aria-hidden="true" className="absolute -bottom-4 -right-4 h-24 w-24 border-b border-r border-gold-light/60" />
          </div>
          <div>
            <Reveal>
              <p className="eyebrow">{t("title")}</p>
              <h1 className="font-display mt-5 text-[34px] leading-[1.1] md:text-[57px]">{about.title}</h1>
              {about.name && <p className="mt-4 text-[19px] text-gold-light">{about.name}</p>}
            </Reveal>
            <GoldRule className="mt-8" />
            <Reveal delay={0.1} className="mt-8 space-y-5 text-[17px] leading-[29px] text-ink/85">
              {about.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex items-center gap-3 text-[15px] text-muted">
              <CameraIcon className="h-5 w-5 text-gold-light" />
              {t("gear")}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-line/50 bg-deep">
        <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
          <Reveal className="flex items-center gap-4">
            <Mark className="h-7 w-auto" title="" />
            <h2 className="eyebrow">{t("values")}</h2>
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[6px] border border-line/60 bg-line/60 md:grid-cols-3">
            {about.values.map((v, i) => (
              <Reveal as="li" key={i} delay={i * 0.1} className="bg-deep p-8 md:p-10">
                <span className="text-[13px] text-gold-light">0{i + 1}</span>
                <h3 className="font-display mt-4 text-[22px]">{v.title}</h3>
                <p className="mt-4 text-[15px] leading-6 text-ink/75">{v.text}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-14">
            <ButtonLink href="/contacto">{t("cta")}</ButtonLink>
          </Reveal>
        </div>
      </section>
      <FinalCta settings={settings} />
    </>
  );
}
