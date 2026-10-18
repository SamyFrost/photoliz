import { getTranslations } from "next-intl/server";
import { Mark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="grain relative flex min-h-[80vh] flex-col items-center justify-center gap-8 px-5 pt-24 text-center">
      <Mark className="h-16 w-auto" title="" />
      <h1 className="font-display text-[28px] md:text-[40px]">{t("title")}</h1>
      <ButtonLink href="/">{t("cta")}</ButtonLink>
    </section>
  );
}
