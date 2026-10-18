"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";
import { useIntro } from "@/components/intro/IntroProvider";
import { buttonClass } from "@/components/ui/ButtonLink";

const EXPRESSIVE = [0.3, 0, 0, 1] as const;

const links: { href: StaticPathname; key: "portfolio" | "services" | "about" | "contact" }[] = [
  { href: "/portafolio", key: "portfolio" },
  { href: "/servicios", key: "services" },
  { href: "/sobre-mi", key: "about" },
  { href: "/contacto", key: "contact" },
];

function LanguageSwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const next = locale === "es" ? "en" : "es";
  return (
    <button
      type="button"
      onClick={() =>
        // @ts-expect-error -- pathname and params come from the current route, so they always match.
        router.replace({ pathname, params }, { locale: next, scroll: false })
      }
      className={`eyebrow cursor-pointer !text-ink/80 transition-colors hover:!text-gold-light ${className}`}
      aria-label={t("language")}
      lang={next}
    >
      {t("languageShort")}
    </button>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { done } = useIntro();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the route changes (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-[480ms] ease-standard ${
          scrolled || open ? "border-b border-line/60 bg-night/80 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-10">
          <Link href="/" className="relative z-10 block" aria-label="PHOLIZ">
            <span data-nav-logo className={`block transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}>
              <Logo className="h-[15px] w-auto md:h-[18px]" />
            </span>
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`group relative py-2 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    isActive(l.href) ? "text-gold-light" : "text-ink/85 hover:text-ink"
                  }`}
                >
                  {t(l.key)}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold-light transition-transform duration-[480ms] ease-expressive ${
                      isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <LanguageSwitch className="hidden sm:block" />
            <Link href="/contacto" className={buttonClass("gold", "hidden !px-5 !py-2.5 !text-[13px] md:inline-flex")}>
              {t("book")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="relative z-10 flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[7px] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("close") : t("menu")}
            >
              <span className={`h-px w-7 bg-ink transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`h-px w-7 bg-ink transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="grain fixed inset-0 z-40 flex flex-col bg-night px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EXPRESSIVE }}
          >
            <ul className="flex flex-col gap-2">
              {[{ href: "/" as StaticPathname, key: "home" as const }, ...links].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EXPRESSIVE }}
                >
                  <Link
                    href={l.href}
                    className={`font-display flex items-baseline gap-4 py-3 text-[26px] ${isActive(l.href) && l.href !== "/" ? "text-gold-light" : ""}`}
                  >
                    <span className="font-sans text-[12px] tracking-normal text-gold-light">0{i + 1}</span>
                    {t(l.key)}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between">
              <Link href="/contacto" className={buttonClass("gold", "!px-6")}>
                {t("book")}
              </Link>
              <LanguageSwitch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
