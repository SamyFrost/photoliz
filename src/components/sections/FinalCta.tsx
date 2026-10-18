import { getTranslations } from "next-intl/server";
import { ButtonLink, ExternalButton } from "@/components/ui/ButtonLink";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { GoldRule, Reveal } from "@/components/ui/Reveal";
import type { SiteSettings } from "@/lib/types";
import { instagramLink, whatsappLink } from "@/lib/site";

export async function FinalCta({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations("home");
  const nav = await getTranslations("nav");
  const contact = await getTranslations("contact");
  return (
    <section className="grain relative overflow-hidden bg-deep">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "url(/brand/pholiz-pattern.svg)", backgroundSize: "240px" }}
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-5 py-28 text-center md:px-10 md:py-40">
        <Reveal>
          <h2 className="font-display max-w-4xl text-[30px] leading-[1.15] md:text-[57px] md:leading-[1.05]">{t("ctaTitle")}</h2>
        </Reveal>
        <GoldRule className="mx-auto mt-8" />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-lg text-[17px] leading-7 text-ink/80">{t("ctaText")}</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contacto">{nav("book")}</ButtonLink>
          <ExternalButton href={whatsappLink(settings.whatsapp, contact("whatsappText"))} variant="outline">
            <WhatsAppIcon /> WhatsApp
          </ExternalButton>
          <ExternalButton href={instagramLink(settings.instagram)} variant="outline">
            <InstagramIcon /> @{settings.instagram}
          </ExternalButton>
        </Reveal>
      </div>
    </section>
  );
}
