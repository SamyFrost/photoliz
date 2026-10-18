import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { jost, lexendZetta } from "../fonts";
import { introBootScript } from "@/components/intro/IntroProvider";
import { IntroSting } from "@/components/intro/IntroSting";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CameraCursor } from "@/components/layout/CameraCursor";
import { getSettings } from "@/lib/content";
import { SITE } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#23143a" };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t("title"), template: "%s · PHOLIZ" },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: "PHOLIZ",
      locale: locale === "es" ? "es_US" : "en_US",
      images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "PHOLIZ · PHOTOGRAPHY ∞ FILMS" }],
    },
    alternates: { languages: { es: "/", en: "/en" } },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const settings = await getSettings(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "PHOLIZ · Photography ∞ Films",
    description: "Photographer and filmmaker for portraits, weddings, quinceañeras, events and brands.",
    url: SITE.url,
    image: `${SITE.url}/images/og.jpg`,
    telephone: settings.whatsapp,
    email: settings.email,
    address: { "@type": "PostalAddress", addressLocality: "Tampa", addressRegion: "FL", addressCountry: "US" },
    areaServed: "Tampa Bay, Florida",
    sameAs: [`https://instagram.com/${settings.instagram}`],
  };

  return (
    <html lang={locale} className={`${lexendZetta.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider>
          <IntroSting />
          <SmoothScroll />
          <CameraCursor />
          <Navbar />
          <main>{children}</main>
          <Footer settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
