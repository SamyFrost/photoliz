import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui", padding: 40, maxWidth: 560, lineHeight: 1.6 }}>
        <h1>Panel PHOLIZ</h1>
        <p>
          El panel todavía no está conectado. Crea el proyecto en sanity.io y agrega
          <code> NEXT_PUBLIC_SANITY_PROJECT_ID </code> en las variables de entorno (ver README).
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
