import { GoldRule, Reveal } from "./Reveal";

/** Numbered section title: "01 — PORTAFOLIO / Historias en luz". */
export function SectionHeading({
  index,
  eyebrow,
  title,
  text,
  align = "left",
}: {
  index?: string;
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <Reveal className={`relative ${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      {index && (
        <span
          aria-hidden="true"
          className={`font-display pointer-events-none absolute -top-10 select-none text-[88px] leading-none text-ink/[0.05] md:-top-16 md:text-[140px] ${center ? "left-1/2 -translate-x-1/2" : "-left-2"}`}
        >
          {index}
        </span>
      )}
      <p className="eyebrow relative">{eyebrow}</p>
      <h2 className="font-display relative mt-4 text-[28px] leading-[1.15] md:text-[44px]">{title}</h2>
      <GoldRule className={`mt-6 ${center ? "mx-auto" : ""}`} />
      {text && <p className="mt-6 text-[17px] leading-7 text-muted md:text-[19px] md:leading-[29px]">{text}</p>}
    </Reveal>
  );
}
