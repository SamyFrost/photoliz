"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { PlayIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import type { Film } from "@/lib/types";

/** Turns a YouTube or Vimeo link into its embeddable player URL. */
function embedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu")) {
      const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (u.hostname.includes("vimeo")) return `https://player.vimeo.com/video/${u.pathname.split("/").filter(Boolean).pop()}?autoplay=1`;
  } catch {}
  return null;
}

export function FilmGrid({ films }: { films: Film[] }) {
  const t = useTranslations("portfolio");
  const [playing, setPlaying] = useState<Film | null>(null);
  const src = playing ? embedUrl(playing.url) : null;

  return (
    <>
      <ul className="grid gap-5 md:grid-cols-2">
        {films.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => (embedUrl(f.url) ? setPlaying(f) : window.open(f.url, "_blank"))}
              className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-[6px] bg-surface text-left"
              data-cursor="camera"
            >
              {f.cover ? (
                <Photo image={f.cover} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-expressive group-hover:scale-[1.05]" />
              ) : (
                <BrandPlaceholder />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-deep/90 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/60 bg-night/40 backdrop-blur transition-all duration-500 group-hover:scale-110 group-hover:border-gold-light group-hover:text-gold-light">
                <PlayIcon />
                <span className="sr-only">{t("play")}</span>
              </span>
              <span className="absolute bottom-5 left-5 text-[15px] font-semibold uppercase tracking-[0.16em]">{f.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {playing && src && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={playing.title}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-deep/95 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(null)}
          >
            <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-[6px]">
              <iframe src={src} title={playing.title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            </div>
            <button type="button" onClick={() => setPlaying(null)} className="eyebrow absolute right-5 top-5 cursor-pointer rounded-full border border-line px-4 py-2 !text-ink">
              {t("close")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
