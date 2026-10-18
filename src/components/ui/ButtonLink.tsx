import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

const variants = {
  gold: "bg-gold-light text-night hover:bg-[#d8b773]",
  outline: "border border-ink/30 text-ink hover:border-gold-light hover:text-gold-light",
  ghost: "text-gold-light hover:text-ink",
};

export const buttonClass = (variant: keyof typeof variants = "gold", extra = "") =>
  `group inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-[15px] font-semibold tracking-wide transition-colors duration-[290ms] ease-standard ${variants[variant]} ${extra}`;

export function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 transition-transform duration-[290ms] ease-standard group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

type Props = ComponentProps<typeof Link> & { variant?: keyof typeof variants; arrow?: boolean };

export function ButtonLink({ variant = "gold", arrow = true, className = "", children, ...rest }: Props) {
  return (
    <Link {...rest} className={buttonClass(variant, className)}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function ExternalButton({
  variant = "gold",
  className = "",
  children,
  ...rest
}: ComponentProps<"a"> & { variant?: keyof typeof variants }) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest} className={buttonClass(variant, className)}>
      {children}
    </a>
  );
}
