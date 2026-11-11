import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

const env = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");

// Statische Website. Gebaut wird entweder von GitHub Pages (https://m0b4.github.io/metal-im-dorf)
// oder von Cloudflare (Pages bzw. Workers Builds), das erkennt der Build an den Umgebungsvariablen.
// Bei Cloudflare liegt die Seite im Wurzelverzeichnis von https://metal-im-dorf.de (SITE_URL überschreibt das).
const onCloudflare = Boolean(process.env.CF_PAGES || process.env.WORKERS_CI);
const hosting = onCloudflare ? "cloudflare" : "github";

export default defineConfig({
  output: "static",
  site: process.env.SITE_URL || (onCloudflare ? "https://metal-im-dorf.de" : "https://m0b4.github.io"),
  // CSS direkt in die Seite schreiben: kein zusätzlicher Request, der das erste Anzeigen blockiert.
  build: { inlineStylesheets: "always" },
  base: !onCloudflare && process.env.NODE_ENV === "production" ? "/metal-im-dorf" : "/",
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
    // Für die Datenschutzerklärung: welcher Hoster die Seite gerade ausliefert.
    define: { "import.meta.env.HOSTING": JSON.stringify(hosting) },
  },
});
