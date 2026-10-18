# PHOLIZ · Photography ∞ Films

Sitio web de PHOLIZ (Tampa, FL): landing animada con intro del logo, portafolio, catálogo de servicios y contacto, en español e inglés, más un **panel privado** en `/studio` donde se suben y ordenan las fotos.

- **Stack:** Next.js 16 · Tailwind CSS 4 · GSAP + Motion + Lenis · next-intl · Sanity · Resend · Vercel.
- **Marca:** colores, fuentes (Lexend Zetta y Jost), logos y patrón salen del brand kit "PhoLiz".
- **Paths del logo:** `src/components/brand/logo-paths.ts` contiene los trazos reales del logo, separados letra por letra. El intro los anima sin redibujar el logo.

## Correr en local

```bash
npm install
cp .env.example .env.local   # completar cuando existan las cuentas
npm run dev                  # http://localhost:3000
```

El sitio funciona sin conectar Sanity: usa el contenido de `src/content/fallback.ts`. Mientras no haya fotos subidas, las tarjetas muestran placeholders de marca.

## Estructura

| Ruta (ES / EN) | Archivo |
|---|---|
| `/` · `/en` | `src/app/[locale]/page.tsx` |
| `/portafolio` · `/en/portfolio` (+ `/[categoria]`) | `src/app/[locale]/portafolio/` |
| `/servicios` · `/en/services` | `src/app/[locale]/servicios/page.tsx` |
| `/sobre-mi` · `/en/about` | `src/app/[locale]/sobre-mi/page.tsx` |
| `/contacto` · `/en/contact` | `src/app/[locale]/contacto/page.tsx` |
| `/studio` (privado, `noindex`) | `src/app/studio/` + `sanity.config.ts` |

Otros archivos clave:
- Textos fijos de la interfaz: `messages/es.json` y `messages/en.json`.
- Contenido editable: esquemas en `src/sanity/schemas/` y lectura en `src/lib/content.ts`.
- Intro: `src/components/intro/IntroSting.tsx`. Se muestra una vez por sesión, trae botón "Saltar" y respeta reduced-motion.

---

## Puesta en marcha paso a paso

### 1. Sanity (el panel de fotos)
1. Crear una cuenta en <https://www.sanity.io> (gratis) y un proyecto nuevo con dataset `production`.
2. Copiar el **Project ID** en `NEXT_PUBLIC_SANITY_PROJECT_ID` (local y en Vercel).
3. En *sanity.io/manage → API → CORS origins*, agregar `http://localhost:3000` y `https://pholiz.com` con **Allow credentials** activado.
4. Cargar el contenido inicial (categorías, paquetes, "Sobre mí" y ajustes):
   ```bash
   npx sanity login
   npm run seed
   ```
5. En *Members*, invitar a tu hermana con su correo como **Editor**.

### 2. Vercel (hosting gratis)
1. En <https://vercel.com>, entrar con GitHub e importar el repo `photoliz`.
2. Cargar las variables de `.env.example`.
3. Cada push a `main` publica el sitio.

### 3. Actualización inmediata al publicar
1. En *sanity.io/manage → API → Webhooks*, crear uno nuevo:
   - URL: `https://pholiz.com/api/revalidate`
   - Trigger on: create, update y delete
   - Secret: el mismo valor que `SANITY_REVALIDATE_SECRET`
2. Con esto, cada vez que ella pulse **Publish**, la siguiente visita ya muestra el cambio.

### 4. Formulario de contacto
1. Crear una cuenta en <https://resend.com> y copiar la API key en `RESEND_API_KEY`.
2. Al tener el dominio, verificar `pholiz.com` en Resend y usar `CONTACT_FROM="PHOLIZ <hola@pholiz.com>"`.
3. Mientras el formulario no esté configurado, el sitio ofrece WhatsApp como alternativa.

### 5. Dominio pholiz.com
1. Comprarlo en Cloudflare Registrar o Namecheap (~$10–12 al año).
2. En Vercel → *Settings → Domains*, agregar `pholiz.com` y `www.pholiz.com`.
3. Copiar en el registrador los registros DNS que indique Vercel (A y CNAME). El SSL es automático.
4. Correo `hola@pholiz.com` → Gmail: *Cloudflare → Email Routing* (gratis).

**Costo mensual: $0.** Los planes gratuitos de Vercel Hobby, Sanity Free y Resend Free alcanzan; solo se paga el dominio.

---

## Guía del panel (para la fotógrafa)

Entra a **pholiz.com/studio** con tu cuenta. No hay ningún enlace a esa dirección en el sitio; solo la conoces tú.

| Quiero… | Dónde |
|---|---|
| Subir fotos | **Fotos → ＋**. Arrastra la foto, elige la categoría y pulsa **Publish**. |
| Cambiar el orden | **Fotos (arrastra para ordenar)**: arrastra las fotos arriba o abajo. |
| Mostrar una foto en el inicio | Abre la foto y activa **Destacar en el inicio**. |
| Elegir la portada de una categoría | **Categorías →** la categoría **→ Portada**. |
| Cambiar precios o paquetes | **Servicios y paquetes**. Si dejas el precio vacío, el sitio muestra «Consultar». |
| Agregar un film | **Films → ＋**: pega el link de YouTube o Vimeo. |
| Testimonios | **Testimonios → ＋**. La sección aparece sola cuando hay al menos uno. |
| Foto de portada, frase, cifras, WhatsApp | **Ajustes del sitio**. Para la portada, mejor un PNG sin fondo. |

Consejos:
- Usa el círculo de **hotspot** para marcar lo importante de cada foto, así los recortes nunca cortan una cara.
- Llena la **descripción de la foto**: ayuda a Google y a las personas que usan lector de pantalla.

## Por revisar con ella
- Precios "Desde" (los actuales son un punto de partida).
- Fotos reales de cada categoría.
- Testimonios reales y su bio.
- Cifras para la franja de estadísticas.
