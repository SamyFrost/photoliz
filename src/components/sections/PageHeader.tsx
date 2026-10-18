import { GoldRule, Reveal } from "@/components/ui/Reveal";

/** Title band for inner pages: big display word on the darkroom with a faint pattern. */
export function PageHeader({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <section className="grain relative overflow-hidden border-b border-line/50 bg-night pb-16 pt-36 md:pb-24 md:pt-48">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(201,164,92,0.3) 0%, rgba(201,164,92,0) 65%)" }}
      />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h1 className="font-display text-[34px] leading-[1.1] sm:text-[48px] md:text-[72px]">{title}</h1>
        </Reveal>
        <GoldRule className="mt-8" />
        {text && (
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-[17px] leading-7 text-ink/75 md:text-[19px] md:leading-[29px]">{text}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
