import type { PortableTextBlock } from "@portabletext/types";
import { sanityClient } from "sanity:client";
import { defaultSiteSettings, sitePath, type SiteSettings } from "./site";

// Die Website wird statisch gebaut und liest immer die zuletzt veröffentlichten Inhalte.
function query<T>(groq: string): Promise<T> {
  return sanityClient.fetch<T>(groq, {}, { perspective: "published", useCdn: false });
}

// Bilder ohne hochgeladene Datei (leere Einträge im Studio) werden übersprungen, damit ein
// unvollständiger Eintrag nie den ganzen Build abbricht.
const imageFields = `{ ..., "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;
const image = (field: string) => `"${field}": select(defined(${field}.asset) => ${field} ${imageFields})`;
const images = (field: string) => `"${field}": ${field}[defined(asset)] ${imageFields}`;

export interface SanityImage {
  _type: "image";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  width?: number;
  height?: number;
}

export type Kategorie = "hauptfestival" | "nebenveranstaltung";
export type Vorverkauf = "formular" | "extern" | "abendkasse";

export interface News {
  _id: string;
  titel: string;
  datum?: string;
  bild?: SanityImage;
  bilder?: SanityImage[];
  inhalt?: PortableTextBlock[];
}

export type BandLinkKey = "website" | "facebook" | "instagram" | "spotify" | "bandcamp" | "youtube";

export interface Band {
  _id: string;
  name?: string;
  genre?: string;
  platzhalter?: boolean;
  bild?: SanityImage;
  links?: Partial<Record<BandLinkKey, string>>;
  spielzeit?: string;
}

export interface Veranstaltung {
  _id: string;
  titel: string;
  kategorie: Kategorie;
  beginn: string;
  ende?: string;
  einlass?: string;
  ort?: string;
  adresse?: string;
  /** Eigener Google-Maps-Link aus dem Studio, sonst wird einer aus Ort und Adresse erstellt. */
  kartenLink?: string;
  kurzbeschreibung?: string;
  preis?: string;
  /** Wie es Tickets gibt: Bestellformular der Website, externer Ticketshop oder nur Abendkasse. */
  vorverkauf: Vorverkauf;
  bild?: SanityImage;
  ticketUrl?: string;
  lineup?: Array<{ _key: string; spielzeit?: string; band?: Band }>;
}

export interface FestivalInfo {
  title: string;
  intro?: string;
  sections: Array<{
    _key: string;
    icon?: string;
    title: string;
    body: PortableTextBlock[];
    bilder?: SanityImage[];
    linkLabel?: string;
    linkUrl?: string;
  }>;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const s = await query<{
    intro?: string;
    akzentfarbe?: string;
    email?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    notice?: SiteSettings["notice"];
  } | null>(`*[_id == "siteSettings"][0]{
    "intro": hero.intro,
    "akzentfarbe": select(defined(akzentfarbe.hex) => akzentfarbe.hex, akzentfarbe),
    "email": contact.email,
    "instagramUrl": contact.instagramUrl,
    "facebookUrl": contact.facebookUrl,
    notice
  }`);

  return {
    intro: s?.intro || defaultSiteSettings.intro,
    akzentfarbe: s?.akzentfarbe || undefined,
    email: s?.email || defaultSiteSettings.email,
    instagramUrl: s?.instagramUrl || defaultSiteSettings.instagramUrl,
    facebookUrl: s?.facebookUrl || defaultSiteSettings.facebookUrl,
    notice: { ...defaultSiteSettings.notice, ...s?.notice },
  };
}

export function getNews(): Promise<News[]> {
  return query(`*[_type == "news"] | order(datum desc, _createdAt desc) {
    _id, titel, datum, ${image("bild")}, ${images("bilder")}, inhalt
  }`);
}

const eventFields = `_id, titel, kategorie, beginn, ende, einlass, ort, adresse, kartenLink, kurzbeschreibung, preis, ${image("bild")}, ticketUrl,
  "vorverkauf": coalesce(vorverkauf, select(nurAbendkasse == true => "abendkasse", defined(ticketUrl) => "extern", "formular"))`;

export function getEvents(): Promise<Veranstaltung[]> {
  return query(`*[_type == "veranstaltung" && defined(beginn)] | order(beginn asc) { ${eventFields} }`);
}

/** Nächste kommende Veranstaltung mit Line-Up, das Hauptfestival hat Vorrang. */
export async function getLineupEvent(): Promise<Veranstaltung | null> {
  const upcoming = await query<Veranstaltung[]>(`*[_type == "veranstaltung" && coalesce(ende, beginn) >= now()]
    | order(beginn asc) {
      ${eventFields},
      lineup[] { _key, spielzeit, band-> { _id, name, genre, platzhalter, links, ${image("bild")} } }
    }`);
  return upcoming.find((event) => event.kategorie === "hauptfestival") ?? upcoming[0] ?? null;
}

export async function getFestivalInfo(): Promise<FestivalInfo> {
  const info = await query<Partial<FestivalInfo> | null>(`*[_id == "festivalInfo"][0]{ title, intro, sections[] { ..., ${images("bilder")} } }`);
  return {
    title: info?.title || "Festival-Infos",
    intro: info?.intro,
    sections: info?.sections ?? [],
  };
}

/** Nächste kommende Veranstaltung, das Hauptfestival hat Vorrang. */
export function nextEvent(events: Veranstaltung[], now = Date.now()) {
  const upcoming = events.filter((event) => !isPast(event, now));
  return upcoming.find((event) => event.kategorie === "hauptfestival") ?? upcoming[0];
}

/** Ziel des Ticket-Buttons: externer Shop oder das Bestellformular der Website. Leer bei „Nur Abendkasse“. */
export function ticketLink(event: Pick<Veranstaltung, "_id" | "vorverkauf" | "ticketUrl">) {
  if (event.vorverkauf === "abendkasse") return undefined;
  if (event.vorverkauf === "extern" && event.ticketUrl) return { href: event.ticketUrl, external: true };
  return { href: sitePath(`/tickets?veranstaltung=${encodeURIComponent(event._id)}`), external: false };
}

/** Bestellung über das Formular der Website. */
export function hasTicketForm(event: Pick<Veranstaltung, "vorverkauf" | "ticketUrl">) {
  return event.vorverkauf === "formular" || (event.vorverkauf === "extern" && !event.ticketUrl);
}

export function isPast(event: Pick<Veranstaltung, "beginn" | "ende">, now = Date.now()) {
  return new Date(event.ende || event.beginn).getTime() < now;
}
