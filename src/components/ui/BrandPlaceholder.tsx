import { Mark } from "@/components/brand/Logo";
import { asset } from "@/lib/site";

/**
 * Stand-in for a photo that hasn't been uploaded yet: the darkroom violet with the P·L mark,
 * a fine gold rule and a label. Disappears as soon as a real photo exists in the Studio.
 */
export function BrandPlaceholder({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-b from-surface to-deep ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{ backgroundImage: `url(${asset("/brand/pholiz-pattern.svg")})`, backgroundSize: "180px" }}
        aria-hidden="true"
      />
      <Mark className="relative h-10 w-auto opacity-70" title="" />
      {label && <span className="eyebrow relative px-4 text-center !text-muted">{label}</span>}
    </div>
  );
}
