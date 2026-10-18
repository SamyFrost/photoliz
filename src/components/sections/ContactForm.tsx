"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Arrow, buttonClass } from "@/components/ui/ButtonLink";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { IS_STATIC, whatsappLink } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "whatsapp" | "error" | "invalid";

const field =
  "peer w-full border-b border-line bg-transparent pb-3 pt-6 text-[16px] text-ink outline-none transition-colors placeholder:text-transparent focus:border-gold-light aria-[invalid=true]:border-[#fe8477]";
const label =
  "pointer-events-none absolute left-0 top-6 origin-left text-[15px] text-muted transition-all duration-[290ms] ease-standard peer-focus:top-0 peer-focus:scale-[0.8] peer-focus:text-gold-light peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.8]";

export function ContactForm({ services, whatsapp }: { services: string[]; whatsapp: string }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const preset = useSearchParams().get("servicio") ?? "";
  const [status, setStatus] = useState<Status>("idle");
  const [bad, setBad] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (IS_STATIC) {
      // No server on the static copy: hand the message to WhatsApp, already written.
      const lines = [t("whatsappText"), "", data.name, data.email, data.phone, data.service, data.date, "", data.message];
      window.open(whatsappLink(whatsapp, lines.filter((l) => l !== undefined && l !== null).join("\n").trim()), "_blank", "noopener");
      setStatus("whatsapp");
      return;
    }
    setStatus("sending");
    setBad([]);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("sent");
        (e.target as HTMLFormElement).reset();
      } else if (json.error === "invalid") {
        setBad(json.fields ?? []);
        setStatus("invalid");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const invalid = (name: string) => (bad.includes(name) ? true : undefined);
  const options = preset && !services.includes(preset) ? [preset, ...services] : services;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-6 md:grid-cols-2">
      <div className="relative">
        <input id="name" name="name" required autoComplete="name" placeholder=" " className={field} aria-invalid={invalid("name")} />
        <label htmlFor="name" className={label}>{t("name")}</label>
      </div>
      <div className="relative">
        <input id="email" name="email" type="email" required autoComplete="email" placeholder=" " className={field} aria-invalid={invalid("email")} />
        <label htmlFor="email" className={label}>{t("email")}</label>
      </div>
      <div className="relative">
        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder=" " className={field} />
        <label htmlFor="phone" className={label}>{t("phone")}</label>
      </div>
      <div className="relative">
        <input id="date" name="date" placeholder=" " className={field} />
        <label htmlFor="date" className={label}>{t("date")}</label>
      </div>
      <div className="relative md:col-span-2">
        <label htmlFor="service" className="text-[12px] text-muted">{t("service")}</label>
        <select
          id="service"
          name="service"
          defaultValue={preset}
          className="mt-1 w-full cursor-pointer appearance-none border-b border-line bg-transparent pb-3 pt-2 text-[16px] text-ink outline-none focus:border-gold-light"
        >
          <option value="" className="bg-night">{t("servicePlaceholder")}</option>
          {options.map((s) => (
            <option key={s} value={s} className="bg-night">{s}</option>
          ))}
          <option value={t("other")} className="bg-night">{t("other")}</option>
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-4 right-1 text-gold-light">▾</span>
      </div>
      <div className="relative md:col-span-2">
        <textarea id="message" name="message" required rows={4} placeholder=" " className={`${field} resize-none`} aria-invalid={invalid("message")} />
        <label htmlFor="message" className={label}>{t("message")}</label>
      </div>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center">
        <button type="submit" disabled={status === "sending"} className={buttonClass("gold", "cursor-pointer disabled:opacity-60")}>
          {status === "sending" ? t("sending") : t("send")}
          <Arrow />
        </button>
        <AnimatePresence mode="wait">
          {(status === "sent" || status === "whatsapp" || status === "error" || status === "invalid") && (
            <motion.p
              key={status}
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[15px] ${status === "sent" || status === "whatsapp" ? "text-[#3fc6a0]" : "text-[#fe8477]"}`}
            >
              {status === "sent"
                ? `✓ ${t("sent")}`
                : status === "whatsapp"
                  ? t("whatsappOpened")
                  : status === "invalid"
                    ? t("invalid")
                    : t("error")}
              {status === "error" && (
                <a href={whatsappLink(whatsapp, t("whatsappText"))} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1.5 text-gold-light underline">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
