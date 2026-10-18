import { DESCRIPTOR, FOOT, LETTERS, LOGO_VIEWBOX } from "./logo-paths";

const WHITE = "#ffffff";
const GOLD = "#c9a45c";

/** PHOLIZ wordmark drawn from the brand kit's own paths (on-dark version). */
export function Logo({
  withDescriptor = false,
  className,
  title = "PHOLIZ",
}: {
  withDescriptor?: boolean;
  className?: string;
  title?: string;
}) {
  // Without the descriptor the wordmark is cropped to the letters.
  const viewBox = withDescriptor ? LOGO_VIEWBOX : "-2 -103 841 106";
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={title} focusable="false">
      {LETTERS.map((l) => (
        <path key={l.id} d={l.d} fill={WHITE} />
      ))}
      <path d={FOOT} fill={GOLD} />
      {withDescriptor &&
        [...DESCRIPTOR.photography, DESCRIPTOR.infinity, ...DESCRIPTOR.films].map((d, i) => (
          <path key={i} d={d} fill={GOLD} />
        ))}
    </svg>
  );
}

/** The P·L mark alone: white P, gold foot of the L. */
export function Mark({ className, title = "PHOLIZ" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="-4 -104 94 108" className={className} role="img" aria-label={title} focusable="false">
      <path d={LETTERS[0].d} fill={WHITE} />
      <path d={FOOT} fill={GOLD} />
    </svg>
  );
}
