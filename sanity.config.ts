"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletons } from "./src/sanity/schemas";

export default defineConfig({
  name: "pholiz",
  title: "PHOLIZ · Panel",
  basePath: "/studio",
  projectId: projectId || "missing",
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created again from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletons.includes(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
  plugins: [
    structureTool({
      title: "Contenido",
      structure: (S, context) =>
        S.list()
          .title("PHOLIZ")
          .items([
            orderableDocumentListDeskItem({ type: "photo", title: "Fotos (arrastra para ordenar)", S, context }),
            orderableDocumentListDeskItem({ type: "category", title: "Categorías", S, context }),
            orderableDocumentListDeskItem({ type: "film", title: "Films", S, context }),
            orderableDocumentListDeskItem({ type: "servicePackage", title: "Servicios y paquetes", S, context }),
            orderableDocumentListDeskItem({ type: "testimonial", title: "Testimonios", S, context }),
            S.divider(),
            S.listItem().title("Sobre mí").id("about").child(S.document().schemaType("about").documentId("about")),
            S.listItem()
              .title("Ajustes del sitio")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
