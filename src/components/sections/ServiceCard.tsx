import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import type { ServicePackage } from "@/lib/types";
import { whatsappLink } from "@/lib/site";

const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export async function ServiceCard({ service, whatsapp }: { service: ServicePackage; whatsapp: string }) {
  const t = await getTranslations("services");
  return (
    <article
      className={`group relative flex h-full flex-col rounded-[6px] border p-7 transition-colors duration-[480ms] ease-standard md:p-8 ${
        service.highlight ? "border-gold-light/60 bg-surface" : "border-line/70 bg-surface/50 hover:border-gold-light/40"
      }`}
    >
      {service.highlight && (
        <span className="eyebrow absolute -top-2.5 left-7 rounded-full bg-gold-light px-3 py-1 !text-[10px] !text-night">
          {t("favorite")}
        </span>
      )}
      <h3 className="text-[20px] font-semibold leading-snug md:text-[23px]">{service.name}</h3>
      <p className="mt-5 flex items-baseline gap-2">
        {service.priceFrom != null ? (
          <>
            <span className="eyebrow !text-muted">{t("from")}</span>
            <span className="font-display text-[33px] tabular-nums !tracking-[0.04em] text-gold-light">
              {price.format(service.priceFrom)}
            </span>
          </>
        ) : (
          <span className="font-display text-[23px] text-gold-light">{t("ask")}</span>
        )}
      </p>
      <span className="mt-6 block h-px w-full bg-line/70" />
      <ul className="mt-6 flex-1 space-y-3 text-[15px] text-ink/85">
        {service.includes.map((item) => (
          <li key={item} className="flex gap-3">
            <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-light" />
            {item}
          </li>
        ))}
      </ul>
      {service.delivery && <p className="mt-6 text-[13px] text-muted">{service.delivery}</p>}
      <div className="mt-7 flex flex-col gap-2.5">
        <a
          href={whatsappLink(whatsapp, t("whatsappText", { service: service.name }))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gold-light px-5 py-3 text-[14px] font-semibold text-night transition-colors hover:bg-[#d8b773]"
        >
          <WhatsAppIcon className="h-[18px] w-[18px]" />
          {t("whatsapp")}
        </a>
        <Link
          href={{ pathname: "/contacto", query: { servicio: service.name } }}
          className="inline-flex items-center justify-center rounded-full border border-ink/25 px-5 py-3 text-[14px] font-semibold transition-colors hover:border-gold-light hover:text-gold-light"
        >
          {t("quote")}
        </Link>
      </div>
    </article>
  );
}
