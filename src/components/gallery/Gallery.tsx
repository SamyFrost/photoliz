"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { Photo } from "@/components/ui/Photo";
import type { Photo as PhotoT } from "@/lib/types";
import { Lightbox } from "./Lightbox";

const EXPRESSIVE = [0.3, 0, 0, 1] as const;
// Placeholder rhythm so the empty masonry still looks composed.
const RATIOS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"];

/** Masonry gallery with a swipeable lightbox. */
export function Gallery({ photos }: { photos: PhotoT[] }) {
  const t = useTranslations("portfolio");
  const reduce = useReducedMotion();
  const [index, setIndex] = useState<number | null>(null);

  if (!photos.length) {
    return (
      <div>
        <p className="mb-8 text-muted">{t("empty")}</p>
        <div className="columns-2 gap-3 md:columns-3 md:gap-5">
          {RATIOS.map((r, i) => (
            <div key={i} className={`mb-3 overflow-hidden rounded-[6px] md:mb-5 ${r}`}>
              <BrandPlaceholder label={t("placeholder")} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
        {photos.map((p, i) => (
          <motion.button
            type="button"
            key={p.id}
            data-cursor="camera"
            onClick={() => setIndex(i)}
            className="group relative mb-3 block w-full cursor-pointer overflow-hidden rounded-[6px] bg-surface md:mb-5"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.8, delay: (i % 4) * 0.06, ease: EXPRESSIVE }}
            aria-label={p.image.alt || p.title || "PHOLIZ"}
          >
            <Photo
              image={p.image}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-auto w-full transition-transform duration-[1200ms] ease-expressive group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-deep/0 transition-colors duration-500 group-hover:bg-deep/20" />
          </motion.button>
        ))}
      </div>
      <Lightbox photos={photos} index={index} onChange={setIndex} />
    </>
  );
}
