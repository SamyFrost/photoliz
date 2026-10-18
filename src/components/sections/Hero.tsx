"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useIntro } from "@/components/intro/IntroProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Photo } from "@/components/ui/Photo";
import type { SiteSettings } from "@/lib/types";

const EXPRESSIVE = [0.3, 0, 0, 1] as const;
const WORD = "PHOLIZ".split("");

/**
 * Layered hero: the giant PHOLIZ word sits behind the cut-out portrait, each layer moving at its
 * own pace on scroll. Everything waits for the logo intro to finish before it enters.
 */
export function Hero({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("hero");
  const { done } = useIntro();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const show = done || reduce;
  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 40 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease: EXPRESSIVE },
  });

  return (
    <section ref={ref} className="grain relative flex min-h-[100svh] overflow-hidden bg-night">
      {/* light leak */}
      <div
        aria-hidden="true"
        className="absolute -right-[20%] top-[10%] h-[70vmax] w-[70vmax] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(201,164,92,0.35) 0%, rgba(201,164,92,0) 60%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "linear-gradient(to top, #170c28 0%, rgba(23,12,40,0) 100%)" }}
      />

      {/* giant word behind the portrait */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: wordY }}
        className="pointer-events-none absolute inset-x-0 top-[12%] flex select-none justify-center md:top-[16%]"
      >
        {WORD.map((ch, i) => (
          <motion.span
            key={i}
            className="font-display text-[19vw] leading-none !tracking-[0.02em] text-surface-alt md:text-[15vw]"
            initial={reduce ? false : { opacity: 0, y: "60%" }}
            animate={show ? { opacity: 1, y: "0%" } : undefined}
            transition={{ duration: 1.2, delay: 0.1 + i * 0.07, ease: EXPRESSIVE }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.div>

      {/* portrait */}
      <motion.div
        style={reduce ? undefined : { y: photoY }}
        className="pointer-events-none absolute left-1/2 top-16 w-[min(100vw,520px)] -translate-x-1/2 md:bottom-0 md:left-auto md:right-[6%] md:top-auto md:w-[min(44vw,620px)] md:translate-x-0"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 80, scale: 1.04 }}
          animate={show ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ duration: 1.4, delay: 0.35, ease: EXPRESSIVE }}
        >
          <Photo
            image={settings.heroImage}
            priority
            sizes="(min-width: 768px) 44vw, 100vw"
            className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
          />
        </motion.div>
      </motion.div>

      {/* on phones the copy sits under the face, on a dark fade */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[62%] md:hidden"
        style={{ background: "linear-gradient(to top, #23143a 55%, rgba(35,20,58,0.85) 75%, rgba(35,20,58,0) 100%)" }}
      />

      {/* copy */}
      <motion.div
        style={reduce ? undefined : { y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end px-5 pb-10 pt-28 md:justify-center md:px-10 md:pb-0"
      >
        <div className="max-w-xl">
          <motion.p className="eyebrow" {...enter(0.5)}>
            {t("eyebrow")}
          </motion.p>
          <motion.h1 className="font-display mt-5 text-[32px] leading-[1.12] sm:text-[40px] md:text-[57px] md:leading-[1.05]" {...enter(0.62)}>
            {settings.tagline}
          </motion.h1>
          <motion.span
            aria-hidden="true"
            className="mt-7 block h-px w-20 origin-left bg-gold-light"
            initial={reduce ? false : { scaleX: 0 }}
            animate={show ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.9, ease: EXPRESSIVE }}
          />
          <motion.p className="mt-7 max-w-md text-[16px] leading-7 text-ink/80 md:text-[19px] md:leading-[29px]" {...enter(0.8)}>
            {settings.intro}
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-3" {...enter(0.95)}>
            <ButtonLink href="/contacto">{t("cta")}</ButtonLink>
            <ButtonLink href="/portafolio" variant="outline" arrow={false}>
              {t("secondary")}
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>

      {/* vertical descriptor + scroll cue */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-10 right-6 z-10 hidden flex-col items-center gap-4 md:flex"
        initial={reduce ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.3 }}
      >
        <span className="eyebrow [writing-mode:vertical-rl]">{t("scroll")}</span>
        <span className="relative h-16 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-gold-light" />
        </span>
      </motion.div>
    </section>
  );
}
