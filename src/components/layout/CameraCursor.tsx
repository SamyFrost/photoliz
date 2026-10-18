"use client";

import { useEffect, useRef } from "react";

type Mode = "hidden" | "idle" | "link" | "photo" | "native";

const NATIVE = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]),textarea,select,[contenteditable="true"],iframe';

function modeOf(target: EventTarget | null): Mode {
  const el = target as Element | null;
  if (!el?.closest) return "idle";
  if (el.closest(NATIVE)) return "native";
  if (el.closest('[data-cursor="camera"]')) return "photo";
  if (el.closest('a[href],button,[role="button"],summary,label')) return "link";
  return "idle";
}

/**
 * The site's pointer: a small camera focus mark that replaces the system arrow (mouse and pen
 * only, touch screens are left alone). The corners follow with a slight lag while the centre dot
 * stays on the exact pixel. It tightens on links, opens up over photos and "locks focus" on
 * click with a ring and a soft flash. Text fields and video frames get the normal cursor back.
 */
export function CameraCursor() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = root.current;
    const frameEl = frame.current;
    const dotEl = dot.current;
    if (!el || !frameEl || !dotEl) return;

    const html = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = -100;
    let y = -100;
    let fx = x;
    let fy = y;
    let live = false;
    let raf = 0;
    let scrollRaf = 0;

    const setMode = (m: Mode, target?: EventTarget | null) => {
      if (el.dataset.mode !== m) el.dataset.mode = m;
      // Gold buttons swallow a gold mark, so over them it turns night violet.
      const tone = (target as Element | null)?.closest?.(".bg-gold-light") ? "dark" : "light";
      if (el.dataset.tone !== tone) el.dataset.tone = tone;
    };

    const draw = () => {
      raf = 0;
      fx += (x - fx) * (calm ? 1 : 0.28);
      fy += (y - fy) * (calm ? 1 : 0.28);
      frameEl.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(x - fx) > 0.1 || Math.abs(y - fy) > 0.1) raf = requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!live) {
        live = true;
        fx = x;
        fy = y;
        html.classList.add("has-focus-cursor");
      }
      setMode(modeOf(e.target), e.target);
      schedule();
    };

    // When the page scrolls under a still pointer, re-read what is under it.
    const onScroll = () => {
      if (!live || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const under = document.elementFromPoint(x, y);
        setMode(modeOf(under), under);
      });
    };

    const burst = (px: number, py: number) => {
      if (calm) return;
      const make = (css: string, keyframes: Keyframe[], ms: number, easing: string) => {
        const n = document.createElement("div");
        n.setAttribute("aria-hidden", "true");
        n.style.cssText = `position:fixed;left:${px}px;top:${py}px;pointer-events:none;z-index:119;border-radius:9999px;${css}`;
        document.body.appendChild(n);
        n.animate(keyframes, { duration: ms, easing, fill: "forwards" }).onfinish = () => n.remove();
      };
      // the focus ring that "locks" on the click point
      make(
        "width:14px;height:14px;border:1.5px solid #c9a45c;margin:-7px 0 0 -7px;",
        [
          { transform: "scale(0.6)", opacity: 0.95 },
          { transform: "scale(4.2)", opacity: 0 },
        ],
        650,
        "cubic-bezier(0.2, 0, 0, 1)",
      );
      // a soft shutter flash
      make(
        "width:96px;height:96px;margin:-48px 0 0 -48px;background:radial-gradient(circle, rgba(255,246,222,0.55) 0%, rgba(255,246,222,0) 68%);",
        [{ opacity: 1 }, { opacity: 0 }],
        280,
        "ease-out",
      );
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !live) return;
      el.dataset.down = "true";
      burst(e.clientX, e.clientY);
    };
    const onUp = () => {
      el.dataset.down = "false";
    };
    const onLeave = () => setMode("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    html.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      html.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      html.classList.remove("has-focus-cursor");
    };
  }, []);

  return (
    <div ref={root} className="focus-cursor" data-mode="hidden" data-down="false" data-tone="light" aria-hidden="true">
      <div ref={frame} className="focus-cursor__pos">
        <div className="focus-cursor__box">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square">
            <path d="M2 12V2h10M28 2h10v10M38 28v10H28M12 38H2V28" vectorEffect="non-scaling-stroke" />
            <circle className="focus-cursor__ring" cx="20" cy="20" r="7" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
      <div ref={dot} className="focus-cursor__pos">
        <div className="focus-cursor__dot" />
      </div>
    </div>
  );
}
