// Feste Angaben der Website. Redaktionell änderbare Inhalte kommen aus Sanity (siehe sanity.ts).

export const SITE_NAME = "Metal im Dorf";
export const SITE_DESCRIPTION = "News, Termine und Line-Up vom Metal im Dorf Festival am Opfermoor.";
export const STUDIO_URL = "https://metal-im-dorf.sanity.studio/";
export const ADDRESS = ["Opfermoor Niederdorla", "An der Oberrothe, 99988 Niederdorla"];

/**
 * Zugangsschlüssel von Web3Forms (web3forms.com) für das Ticketformular. Der Schlüssel ist öffentlich
 * und legt fest, an welche Mailadresse die Bestellungen gehen. Leer = das Formular öffnet stattdessen
 * das Mailprogramm der Besucher mit fertig ausgefüllter Mail an die Kontaktadresse.
 */
export const WEB3FORMS_ACCESS_KEY = "";

export interface SiteSettings {
  intro: string;
  email: string;
  instagramUrl?: string;
  facebookUrl?: string;
  notice: {
    enabled: boolean;
    text?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
}

export const defaultSiteSettings: SiteSettings = {
  intro:
    "Das kleine Metal-Festival am Opfermoor Vogtei: direkt, laut und ohne Umwege. Hier findest du aktuelle Ansagen, Bands und Rückblicke.",
  email: "metalimdorf@gmx.de",
  instagramUrl: "https://www.instagram.com/metalimdorf",
  facebookUrl: "https://www.facebook.com/metalimdorf",
  notice: { enabled: false },
};

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * Pfad innerhalb der Website, berücksichtigt den GitHub-Pages-Unterordner.
 * Seitenpfade enden immer mit "/", sonst leitet GitHub Pages bei jedem Klick erst um.
 */
export function sitePath(path = "") {
  const [, pathname = "", rest = ""] = path.match(/^([^?#]*)(.*)$/) ?? [];
  let full = `${basePath}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  if (!full.endsWith("/") && !/\.[a-z0-9]+$/i.test(full)) full += "/";
  return `${full}${rest}`;
}

/** Absolute URL, z. B. für Vorschaubilder beim Teilen und strukturierte Daten. */
export function siteUrl(path = "") {
  return new URL(sitePath(path), import.meta.env.SITE).href;
}

/** Hinweis für Screenreader bei Links, die einen neuen Tab öffnen. */
/** Link zur Kartensuche in Google Maps. */
export function mapsUrl(...parts: Array<string | undefined>) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.filter(Boolean).join(", "))}`;
}

export const NEW_TAB_HINT = "(öffnet in neuem Tab)";
