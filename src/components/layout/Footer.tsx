import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, MailIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import type { SiteSettings } from "@/lib/types";
import { instagramLink, whatsappLink } from "@/lib/site";

export async function Footer({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const contact = await getTranslations("contact");
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-deep">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:py-20">
        <div>
          <Logo withDescriptor className="h-auto w-[260px]" />
          <p className="mt-6 max-w-xs text-muted">{t("tagline")}</p>
        </div>
        <ul className="space-y-3 text-[15px]">
          {(
            [
              ["/portafolio", "portfolio"],
              ["/servicios", "services"],
              ["/sobre-mi", "about"],
              ["/contacto", "contact"],
            ] as const
          ).map(([href, key]) => (
            <li key={href}>
              <Link href={href} className="text-ink/80 transition-colors hover:text-gold-light">
                {nav(key)}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-3 text-[15px]">
          <li>
            <a
              href={whatsappLink(settings.whatsapp, contact("whatsappText"))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-ink/80 transition-colors hover:text-gold-light"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
          </li>
          <li>
            <a
              href={instagramLink(settings.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-ink/80 transition-colors hover:text-gold-light"
            >
              <InstagramIcon /> @{settings.instagram}
            </a>
          </li>
          <li>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all text-ink/80 transition-colors hover:text-gold-light">
              <MailIcon /> {settings.email}
            </a>
          </li>
          <li className="flex items-center gap-3 text-ink/80">
            <PinIcon /> {settings.location}
          </li>
        </ul>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-line/40 px-5 py-6 text-[13px] text-muted md:flex-row md:justify-between md:px-10">
        <span>
          © {year} PHOLIZ · {t("rights")}
        </span>
        <span className="tracking-[0.2em]">PHOTOGRAPHY ∞ FILMS</span>
      </div>
    </footer>
  );
}
