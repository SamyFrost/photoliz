import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandPlaceholder } from "@/components/ui/BrandPlaceholder";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import type { Category, Photo as PhotoT } from "@/lib/types";

/** Portfolio entry points, one tall card per category (cover from Sanity, else its first photo). */
export async function CategoryGrid({ categories, photos }: { categories: Category[]; photos: PhotoT[] }) {
  const t = await getTranslations("portfolio");
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-6">
      {categories.map((c, i) => {
        const cover = c.cover ?? photos.find((p) => p.category === c.slug)?.image ?? null;
        return (
          <Reveal as="li" key={c.slug} delay={(i % 6) * 0.07}>
            <Link
              href={{ pathname: "/portafolio/[categoria]", params: { categoria: c.slug } }}
              data-cursor="camera"
              className="group relative block aspect-[3/4.4] overflow-hidden rounded-[6px] bg-surface"
            >
              <div className="absolute inset-0 transition-transform duration-[1200ms] ease-expressive group-hover:scale-[1.06]">
                {cover ? (
                  <Photo image={cover} fill sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw" className="object-cover" />
                ) : (
                  <BrandPlaceholder />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <span className="font-sans text-[12px] text-gold-light">0{i + 1}</span>
                <h3 className="mt-1 text-[13px] font-semibold uppercase tracking-[0.18em] md:text-[14px]">{c.title}</h3>
                <span className="mt-2 flex items-center gap-2 text-[13px] text-ink/70 transition-colors group-hover:text-gold-light">
                  {t("view")}
                  <span className="block h-px w-6 origin-left bg-current transition-transform duration-500 ease-expressive group-hover:scale-x-150" />
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
