"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Photo } from "@/components/ui/Photo";
import type { Photo as PhotoT } from "@/lib/types";

const EXPRESSIVE = [0.3, 0, 0, 1] as const;

export function Lightbox({
  photos,
  index,
  onChange,
}: {
  photos: PhotoT[];
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const t = useTranslations("portfolio");
  const open = index !== null;
  const go = useCallback(
    (d: number) => index !== null && onChange((index + d + photos.length) % photos.length),
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go, onChange]);

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.image.alt || "PHOLIZ"}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-deep/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => onChange(null)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={photo.id}
              data-cursor="camera"
              className="relative h-[78vh] w-[92vw] max-w-6xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EXPRESSIVE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1);
                else if (info.offset.x > 80) go(-1);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Photo image={photo.image} fill sizes="92vw" className="pointer-events-none select-none object-contain" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6 text-[13px] text-muted" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => go(-1)} className="cursor-pointer rounded-full border border-line px-4 py-2 transition-colors hover:border-gold-light hover:text-gold-light" aria-label={t("prev")}>
              ←
            </button>
            <span className="tabular-nums">
              {index! + 1} / {photos.length}
            </span>
            <button type="button" onClick={() => go(1)} className="cursor-pointer rounded-full border border-line px-4 py-2 transition-colors hover:border-gold-light hover:text-gold-light" aria-label={t("next")}>
              →
            </button>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="eyebrow absolute right-5 top-5 cursor-pointer rounded-full border border-line px-4 py-2 !text-ink transition-colors hover:border-gold-light"
          >
            {t("close")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
