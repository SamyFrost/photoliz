import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/lib/types";

/** Only rendered once Liz adds real testimonials in the Studio. */
export async function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const t = await getTranslations("home");
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading eyebrow={t("testimonialsEyebrow")} title={t("testimonialsTitle")} align="center" />
      <ul className="mt-16 grid gap-5 md:grid-cols-3">
        {items.slice(0, 6).map((q, i) => (
          <Reveal as="li" key={q.id} delay={i * 0.08} className="rounded-[6px] border border-line/70 bg-surface/40 p-8">
            <span className="font-display text-[48px] leading-none text-gold-light" aria-hidden="true">
              “
            </span>
            <blockquote className="mt-2 text-[17px] leading-7 text-ink/90">{q.quote}</blockquote>
            <p className="mt-6 text-[14px] font-semibold">{q.author}</p>
            <p className="text-[13px] text-muted">{q.event}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
