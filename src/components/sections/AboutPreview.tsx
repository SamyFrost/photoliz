import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Photo } from "@/components/ui/Photo";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Mark } from "@/components/brand/Logo";
import type { About } from "@/lib/types";

export async function AboutPreview({ about }: { about: About }) {
  const t = await getTranslations("home");
  return (
    <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
      <div className="relative mx-auto w-full max-w-md md:max-w-none">
        <MaskReveal className="aspect-[4/5] rounded-[6px]">
          <Photo image={about.portrait} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
        </MaskReveal>
        <div className="absolute -bottom-6 -right-3 flex h-24 w-24 items-center justify-center rounded-full border border-gold-light/50 bg-night md:-right-8 md:h-32 md:w-32">
          <Mark className="h-9 w-auto md:h-12" title="" />
        </div>
        <span aria-hidden="true" className="absolute -left-3 -top-3 h-20 w-20 border-l border-t border-gold-light/60 md:-left-6 md:-top-6" />
      </div>
      <div>
        <SectionHeading index="03" eyebrow={t("aboutEyebrow")} title={about.title} />
        <Reveal delay={0.1} className="mt-8 space-y-5 text-[17px] leading-[29px] text-ink/80">
          {about.body.slice(0, 2).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={0.2} className="mt-10">
          <ButtonLink href="/sobre-mi" variant="outline">
            {t("aboutCta")}
          </ButtonLink>
        </Reveal>
      </div>
    </div>
  );
}
