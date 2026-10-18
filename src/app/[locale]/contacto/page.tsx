import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { InstagramIcon, MailIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { getServices, getSettings } from "@/lib/content";
import { instagramLink, whatsappLink } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/contacto">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contacto">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, settings, services] = await Promise.all([getTranslations("contact"), getSettings(locale), getServices(locale)]);
  const phone = settings.whatsapp.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "+1 ($1) $2-$3");

  const channels = [
    { icon: <WhatsAppIcon />, label: "WhatsApp", value: phone, href: whatsappLink(settings.whatsapp, t("whatsappText")) },
    { icon: <InstagramIcon />, label: "Instagram", value: `@${settings.instagram}`, href: instagramLink(settings.instagram) },
    { icon: <MailIcon />, label: t("email"), value: settings.email, href: `mailto:${settings.email}` },
    { icon: <PinIcon />, label: "Studio", value: settings.location, href: null },
  ];

  return (
    <>
      <PageHeader eyebrow="PHOTOGRAPHY ∞ FILMS" title={t("title")} text={t("subtitle")} />
      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1.6fr_1fr] lg:gap-24">
        <Reveal>
          <Suspense>
            <ContactForm services={[...new Set(services.map((s) => s.name))]} whatsapp={settings.whatsapp} />
          </Suspense>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">{t("orWrite")}</p>
          <ul className="mt-8 divide-y divide-line/60 border-y border-line/60">
            {channels.map((c) => {
              const inner = (
                <>
                  <span className="text-gold-light">{c.icon}</span>
                  <span className="flex flex-col">
                    <span className="text-[12px] uppercase tracking-[0.16em] text-muted">{c.label}</span>
                    <span className="break-all text-[16px]">{c.value}</span>
                  </span>
                </>
              );
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-5 py-5 transition-colors hover:text-gold-light"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-5 py-5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
