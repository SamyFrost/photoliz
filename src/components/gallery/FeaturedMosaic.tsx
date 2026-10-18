import { Photo } from "@/components/ui/Photo";
import { MaskReveal } from "@/components/ui/Reveal";
import type { Photo as PhotoT } from "@/lib/types";

const SPANS = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "md:row-span-2",
  "md:col-span-2",
  "",
  "",
];

/** Editorial grid of the photos marked "Destacar en el inicio". */
export function FeaturedMosaic({ photos }: { photos: PhotoT[] }) {
  return (
    <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-5">
      {photos.map((p, i) => (
        <MaskReveal key={p.id} delay={(i % 4) * 0.08} className={`rounded-[6px] bg-surface ${SPANS[i] ?? ""}`}>
          <div data-cursor="camera" className="group absolute inset-0">
            <Photo
              image={p.image}
              fill
              sizes="(min-width: 768px) 50vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-expressive group-hover:scale-[1.05]"
            />
          </div>
        </MaskReveal>
      ))}
    </div>
  );
}
