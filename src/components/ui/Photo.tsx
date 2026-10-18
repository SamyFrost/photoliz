import Image, { type ImageLoaderProps } from "next/image";
import type { Img } from "@/lib/types";

// Sanity's CDN resizes and converts on its own; local files go through Next's optimizer.
function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 80));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

type Props = {
  image: Img;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Fill the parent (which must be positioned) instead of using intrinsic size. */
  fill?: boolean;
};

export function Photo({ image, className, sizes = "100vw", priority, fill }: Props) {
  const isSanity = image.src.startsWith("https://cdn.sanity.io");
  const common = {
    src: image.src,
    alt: image.alt,
    sizes,
    priority,
    className,
    loader: isSanity ? sanityLoader : undefined,
    placeholder: image.blurDataURL ? ("blur" as const) : ("empty" as const),
    blurDataURL: image.blurDataURL,
    style: image.position ? { objectPosition: image.position } : undefined,
  };
  return fill ? (
    <Image {...common} fill alt={image.alt} />
  ) : (
    <Image {...common} width={image.width} height={image.height} alt={image.alt} />
  );
}
