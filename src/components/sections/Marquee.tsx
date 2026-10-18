/** Endless band: FOTOGRAFÍA ∞ FILMS ∞ … (linear motion is allowed for marquees only). */
export function Marquee({ word }: { word: string }) {
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="flex items-center gap-10 pr-10">
      <span className="font-display text-[40px] text-ink/90 md:text-[72px]">{word}</span>
      <span className="text-[32px] text-gold-light md:text-[56px]">∞</span>
      <span className="font-display text-[40px] text-transparent [-webkit-text-stroke:1px_rgba(243,243,245,0.5)] md:text-[72px]">
        FILMS
      </span>
      <span className="text-[32px] text-gold-light md:text-[56px]">∞</span>
    </span>
  ));
  return (
    <div className="overflow-hidden border-y border-line/50 py-6 md:py-8" aria-hidden="true">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {items}
        {items}
      </div>
    </div>
  );
}
