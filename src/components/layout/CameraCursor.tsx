"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Over anything marked [data-cursor="camera"] the pointer becomes a small gold viewfinder.
 * Only for fine pointers (mouse/trackpad); touch devices keep their normal behaviour.
 */
export function CameraCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const hit = (e.target as Element | null)?.closest?.('[data-cursor="camera"]');
      setActive(Boolean(hit));
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block" aria-hidden="true">
      <div
        className={`-translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-[290ms] ease-standard ${active ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
      >
        <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="#c9a45c" strokeWidth={1.5}>
          <path d="M4 18V4h14M46 4h14v14M60 46v14H46M18 60H4V46" />
          <circle cx="32" cy="32" r="9" />
          <circle cx="32" cy="32" r="1.5" fill="#c9a45c" stroke="none" />
        </svg>
      </div>
    </div>
  );
}
