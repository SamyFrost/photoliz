"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import { DESCRIPTOR, FOOT, LETTERS, LOGO_VIEWBOX } from "@/components/brand/logo-paths";
import { useIntro } from "./IntroProvider";

const EXPRESSIVE = "cubic-bezier(0.3, 0, 0, 1)";
const [P, ...HOLIZ] = LETTERS;
// Centre of the P·L mark and of the whole lockup, in logo units.
const MARK_CENTER = { x: 42.7, y: -50 };
const LOCKUP_CENTER = { x: 418.4, y: -40 };

/**
 * Netflix-style opening: the white P draws itself, the stroke turns gold to form the L, the mark
 * punches in, then H-O-L-I-Z slide out from behind it, PHOTOGRAPHY ∞ FILMS appears with the ∞
 * traced last, and the wordmark flies into its place in the navbar.
 */
export function IntroSting() {
  const t = useTranslations("intro");
  const { finish } = useIntro();
  const overlay = useRef<HTMLDivElement>(null);
  const flyer = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "done" || !overlay.current) return;

    const q = gsap.utils.selector(overlay.current);
    const pPath = q<SVGPathElement>("[data-p]")[0];
    const infinity = q<SVGPathElement>("[data-infinity]")[0];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.style.overflow = "hidden";
    const done = () => {
      root.style.overflow = "";
      finish();
    };

    if (reduce) {
      tl.current = gsap
        .timeline({ onComplete: done })
        .to(overlay.current, { opacity: 0, duration: 0.4, delay: 0.9 });
      return () => {
        tl.current?.kill();
        root.style.overflow = "";
      };
    }

    const pLen = pPath.getTotalLength();
    const infLen = infinity.getTotalLength();

    gsap.set(q("[data-mark]"), {
      x: LOCKUP_CENTER.x - MARK_CENTER.x,
      y: LOCKUP_CENTER.y - MARK_CENTER.y,
      scale: 3,
      svgOrigin: `${MARK_CENTER.x} ${MARK_CENTER.y}`,
    });
    gsap.set(pPath, { strokeDasharray: pLen, strokeDashoffset: pLen, fillOpacity: 0 });
    gsap.set(q("[data-foot]"), { scaleX: 0, svgOrigin: "7.14 -3.5" });
    gsap.set(q("[data-glow]"), { opacity: 0 });
    gsap.set(q("[data-letter]"), { opacity: 0, x: -70 });
    gsap.set(q("[data-glyph]"), { opacity: 0, y: 10 });
    gsap.set(infinity, { strokeDasharray: infLen, strokeDashoffset: infLen, fillOpacity: 0 });

    const navLogo = () => document.querySelector<HTMLElement>("[data-nav-logo]");

    tl.current = gsap
      .timeline({ delay: 0.25, onComplete: done })
      // 1 · the white stroke draws the P from top to bottom
      .to(pPath, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
      .to(pPath, { fillOpacity: 1, strokeOpacity: 0, duration: 0.35, ease: "power1.out" }, "-=0.15")
      // 2 · at the foot the line carries on in gold and becomes the L
      .to(q("[data-foot]"), { scaleX: 1, duration: 0.55, ease: EXPRESSIVE }, "-=0.25")
      .to(q("[data-glow]"), { opacity: 0.9, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" }, "<0.2")
      // 3 · the Netflix punch-in, then the mark settles into its place in the word
      .to(q("[data-mark]"), { scale: 3.6, duration: 0.45, ease: "power2.out" })
      .to(q("[data-mark]"), { x: 0, y: 0, scale: 1, duration: 0.9, ease: EXPRESSIVE })
      // 4 · H-O-L-I-Z slide out from behind the P
      .to(q("[data-letter]"), { opacity: 1, x: 0, duration: 0.7, stagger: 0.08, ease: EXPRESSIVE }, "-=0.55")
      // 5 · PHOTOGRAPHY ∞ FILMS, the ∞ traced last
      .to(q("[data-glyph]"), { opacity: 1, y: 0, duration: 0.5, stagger: 0.02, ease: "power2.out" }, "-=0.3")
      .to(infinity, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, "-=0.1")
      .to(infinity, { fillOpacity: 1, strokeOpacity: 0, duration: 0.25 })
      // 6 · the descriptor bows out and the wordmark flies to the navbar
      .to(q("[data-glyph], [data-infinity]"), { opacity: 0, duration: 0.3 }, "+=0.35")
      .add(() => {
        const target = navLogo();
        const word = q<SVGGElement>("[data-word]")[0];
        if (!target || !flyer.current) return;
        const from = word.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const box = flyer.current.getBoundingClientRect();
        gsap.to(flyer.current, {
          x: to.left - from.left,
          y: to.top - from.top,
          scale: to.width / from.width,
          transformOrigin: `${from.left - box.left}px ${from.top - box.top}px`,
          duration: 0.9,
          ease: EXPRESSIVE,
        });
      })
      .to(q("[data-backdrop]"), { opacity: 0, duration: 0.8, ease: "power1.inOut" }, "+=0.1")
      .to(q("[data-sweep]"), { scaleX: 1, duration: 0.6, ease: EXPRESSIVE }, "<")
      .to(q("[data-sweep]"), { opacity: 0, duration: 0.3 })
      .set(overlay.current, { opacity: 0 }, "+=0.05");

    return () => {
      tl.current?.kill();
      root.style.overflow = "";
    };
  }, [finish]);

  const skip = () => {
    tl.current?.kill();
    gsap.to(overlay.current, {
      opacity: 0,
      duration: 0.35,
      onComplete: () => {
        document.documentElement.style.overflow = "";
        finish();
      },
    });
  };

  return (
    <div ref={overlay} className="intro-overlay fixed inset-0 z-[100]">
      <div data-backdrop className="grain absolute inset-0 bg-night" />
      <div
        data-sweep
        className="absolute left-0 right-0 top-1/2 h-px origin-left scale-x-0 bg-gold-light"
      />
      <div className="absolute inset-0 flex items-center justify-center px-6" aria-hidden="true">
        <div ref={flyer} className="w-[min(82vw,760px)]">
          <svg viewBox={LOGO_VIEWBOX} className="h-auto w-full overflow-visible">
            <defs>
              <filter id="intro-glow" x="-50%" y="-200%" width="200%" height="500%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            <g data-word>
              {HOLIZ.map((l) => (
                <path key={l.id} data-letter d={l.d} fill="#ffffff" />
              ))}
              <g data-mark>
                <path data-p d={P.d} fill="#ffffff" stroke="#ffffff" strokeWidth={1.2} />
                <path data-glow d={FOOT} fill="#c9a45c" filter="url(#intro-glow)" />
                <path data-foot d={FOOT} fill="#c9a45c" />
              </g>
            </g>
            {DESCRIPTOR.photography.map((d, i) => (
              <path key={`p${i}`} data-glyph d={d} fill="#c9a45c" />
            ))}
            <path data-infinity d={DESCRIPTOR.infinity} fill="#c9a45c" stroke="#c9a45c" strokeWidth={0.8} />
            {DESCRIPTOR.films.map((d, i) => (
              <path key={`f${i}`} data-glyph d={d} fill="#c9a45c" />
            ))}
          </svg>
        </div>
      </div>
      <button
        type="button"
        onClick={skip}
        className="eyebrow absolute bottom-8 right-6 cursor-pointer rounded-full border border-line px-4 py-2 !text-muted transition-colors hover:border-gold-light hover:!text-gold-light"
      >
        {t("skip")}
      </button>
    </div>
  );
}
