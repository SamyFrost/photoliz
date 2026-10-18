import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/types";

/** Filter chips: each is a real link, so every category has its own shareable page. */
export async function CategoryFilter({ categories, active }: { categories: Category[]; active?: string }) {
  const t = await getTranslations("portfolio");
  const chip = (on: boolean) =>
    `whitespace-nowrap rounded-full border px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
      on ? "border-gold-light bg-gold-light text-night" : "border-line text-ink/80 hover:border-gold-light hover:text-gold-light"
    }`;
  return (
    <nav aria-label={t("title")} className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <ul className="flex gap-2.5 pb-2">
        <li>
          <Link href="/portafolio" className={chip(!active)} aria-current={!active ? "page" : undefined}>
            {t("all")}
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={{ pathname: "/portafolio/[categoria]", params: { categoria: c.slug } }}
              className={chip(active === c.slug)}
              aria-current={active === c.slug ? "page" : undefined}
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
