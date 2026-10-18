import localFont from "next/font/local";

// Self-hosted brand fonts from the PhoLiz brand kit (OFL-1.1).
export const lexendZetta = localFont({
  src: [{ path: "../../public/brand/fonts/LexendZetta-200.woff2", weight: "200", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const jost = localFont({
  src: [
    { path: "../../public/brand/fonts/Jost-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/brand/fonts/Jost-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-text",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});
