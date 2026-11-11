import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

const env = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");

// Statische Website für GitHub Pages unter https://m0b4.github.io/metal-im-dorf
export default defineConfig({
  output: "static",
  site: "https://m0b4.github.io",
  // CSS direkt in die Seite schreiben: kein zusätzlicher Request, der das erste Anzeigen blockiert.
  build: { inlineStylesheets: "always" },
  base: process.env.NODE_ENV === "production" ? "/metal-im-dorf" : "/",
  integrations: [
    sanity({
      projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID || "hrgrzj9i",
      dataset: env.PUBLIC_SANITY_STUDIO_DATASET || "production",
      useCdn: false,
      apiVersion: "2026-03-26",
    }),
    sitemap(),
    icon({ include: { "simple-icons": ["instagram", "facebook", "spotify", "bandcamp", "youtube"] } }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
