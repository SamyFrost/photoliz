import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// STATIC_EXPORT=1 builds the static copy published on GitHub Pages (see .github/workflows/pages.yml).
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = isStatic
  ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }
  : {
      images: {
        remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
      },
      async headers() {
        return [{ source: "/studio/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
      },
    };

export default createNextIntlPlugin("./src/i18n/request.ts")(nextConfig);
