import { Reveal } from "@/components/ui/Reveal";
import type { Stat } from "@/lib/types";

export function Stats({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <section className="relative border-y border-line/50 bg-deep">
      <ul className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-line/50 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-10">
        {stats.map((s, i) => (
          <Reveal as="li" key={i} delay={i * 0.1} className="flex flex-col items-center gap-2 py-8 text-center md:py-12">
            <span className="font-display text-[26px] text-ink md:text-[33px]">{s.value}</span>
            <span className="eyebrow !text-muted">{s.label}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
