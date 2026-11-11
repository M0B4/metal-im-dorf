import type { PortableTextBlock } from "@portabletext/types";
import { sanityClient } from "sanity:client";
import { defaultSiteSettings, type SiteSettings } from "./site";

// Die Website wird statisch gebaut und liest immer die zuletzt veröffentlichten Inhalte.
function query<T>(groq: string): Promise<T> {
  return sanityClient.fetch<T>(groq, {}, { perspective: "published", useCdn: false });
}

const image = `{ ..., "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

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

export interface News {
  _id: string;
  titel: string;
  datum?: string;
  bild?: SanityImage;
  bilder?: SanityImage[];
  inhalt?: PortableTextBlock[];
}

export interface Band {
  _id: string;
  name?: string;
  genre?: string;
  platzhalter?: boolean;
  bild?: SanityImage;
  spielzeit?: string;
}

export interface Veranstaltung {
  _id: string;
  titel: string;
  kategorie: Kategorie;
  beginn: string;
  ende?: string;
  ort?: string;
  adresse?: string;
  kurzbeschreibung?: string;
  bild?: SanityImage;
  ticketUrl?: string;
  ticketLabel?: string;
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
    email?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    notice?: SiteSettings["notice"];
  } | null>(`*[_id == "siteSettings"][0]{
    "intro": hero.intro,
    "email": contact.email,
    "instagramUrl": contact.instagramUrl,
    "facebookUrl": contact.facebookUrl,
    notice
  }`);

  return {
    intro: s?.intro || defaultSiteSettings.intro,
    email: s?.email || defaultSiteSettings.email,
    instagramUrl: s?.instagramUrl || defaultSiteSettings.instagramUrl,
    facebookUrl: s?.facebookUrl || defaultSiteSettings.facebookUrl,
    notice: { ...defaultSiteSettings.notice, ...s?.notice },
  };
}

export function getNews(): Promise<News[]> {
  return query(`*[_type == "news"] | order(datum desc, _createdAt desc) {
    _id, titel, datum, bild ${image}, bilder[] ${image}, inhalt
  }`);
}

const eventFields = `_id, titel, kategorie, beginn, ende, ort, adresse, kurzbeschreibung, bild ${image}, ticketUrl, ticketLabel`;

export function getEvents(): Promise<Veranstaltung[]> {
  return query(`*[_type == "veranstaltung" && defined(beginn)] | order(beginn asc) { ${eventFields} }`);
}

/** Nächste kommende Veranstaltung mit Line-Up, das Hauptfestival hat Vorrang. */
export async function getLineupEvent(): Promise<Veranstaltung | null> {
  const upcoming = await query<Veranstaltung[]>(`*[_type == "veranstaltung" && coalesce(ende, beginn) >= now()]
    | order(beginn asc) {
      ${eventFields},
      lineup[] { _key, spielzeit, band-> { _id, name, genre, platzhalter, bild ${image} } }
    }`);
  return upcoming.find((event) => event.kategorie === "hauptfestival") ?? upcoming[0] ?? null;
}

export async function getFestivalInfo(): Promise<FestivalInfo> {
  const info = await query<Partial<FestivalInfo> | null>(`*[_id == "festivalInfo"][0]{ title, intro, sections[] { ..., bilder[] ${image} } }`);
  return {
    title: info?.title || "Festival-Infos",
    intro: info?.intro,
    sections: info?.sections ?? [],
  };
}

export function isPast(event: Pick<Veranstaltung, "beginn" | "ende">, now = Date.now()) {
  return new Date(event.ende || event.beginn).getTime() < now;
}
