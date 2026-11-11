/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  /** Wer die Seite ausliefert, gesetzt in astro.config.mjs. */
  readonly HOSTING: "github" | "cloudflare";
}
