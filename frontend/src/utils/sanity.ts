import { sanityClient } from "sanity:client";
import type { PortableTextBlock } from "@portabletext/types";
import type { Slug } from "@sanity/types";
import groq from "groq";
import { defaultSiteSettings, type SiteSettings } from "./site";

const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
const token = import.meta.env.SANITY_API_READ_TOKEN;

function mergeWithDefaults<T extends object>(defaults: T, values?: Partial<T>): T {
  return { ...defaults, ...values };
}

// visualEditingEnabled=true: fetch draft content with stega encoding (local/staging with Presentation tool)
// Static builds must read the latest published content so newly added event pages
// are included immediately instead of waiting for the API CDN cache to refresh.
async function loadQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return sanityClient.fetch<T>(
    query,
    params,
    {
      perspective: visualEditingEnabled ? "drafts" : "published",
      useCdn: false,
      ...(visualEditingEnabled && token ? { token, stega: true } : {}),
    }
  );
}

// Shared image projection — dereferences asset to include dimensions and LQIP
const imageProjection = `{
  ...,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip,
}`;

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await loadQuery<Partial<SiteSettings> | null>(
    groq`*[_type == "siteSettings" && _id == "siteSettings"][0] {
      siteName,
      "accentColor": coalesce(accentColorPicker.hex, accentColor, "#00A8BB"),
      "accentTextColor": coalesce(accentTextColorPicker.hex, accentTextColor, "#050505"),
      logo ${imageProjection},
      defaultSeo {
        title,
        description,
        image ${imageProjection}
      },
      hero {
        ...,
        image ${imageProjection}
      },
      sections,
      navigation,
      footer,
      contact,
      notice
    }`,
  );

  return {
    ...defaultSiteSettings,
    ...settings,
    defaultSeo: mergeWithDefaults(defaultSiteSettings.defaultSeo, settings?.defaultSeo),
    hero: mergeWithDefaults(defaultSiteSettings.hero, settings?.hero),
    sections: {
      nextEvent: mergeWithDefaults(defaultSiteSettings.sections.nextEvent, settings?.sections?.nextEvent),
      eventPosters: mergeWithDefaults(defaultSiteSettings.sections.eventPosters, settings?.sections?.eventPosters),
      news: mergeWithDefaults(defaultSiteSettings.sections.news, settings?.sections?.news),
      lineup: mergeWithDefaults(defaultSiteSettings.sections.lineup, settings?.sections?.lineup),
      history: mergeWithDefaults(defaultSiteSettings.sections.history, settings?.sections?.history),
    },
    navigation: mergeWithDefaults(defaultSiteSettings.navigation, settings?.navigation),
    footer: mergeWithDefaults(defaultSiteSettings.footer, settings?.footer),
    contact: mergeWithDefaults(defaultSiteSettings.contact, settings?.contact),
    notice: mergeWithDefaults(defaultSiteSettings.notice, settings?.notice),
  };
}

export interface FestivalInfoSection {
  _key: string;
  icon: "info" | "route" | "parking" | "camping" | "ticket" | "food" | "rules" | "accessibility" | "safety" | "contact";
  title: string;
  body: PortableTextBlock[];
  linkLabel?: string;
  linkUrl?: string;
}

export interface FestivalInfo {
  kicker: string;
  title: string;
  intro: string;
  sections: FestivalInfoSection[];
}

function defaultTextBlock(key: string, text: string): PortableTextBlock {
  return {
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{_key: `${key}-span`, _type: "span", marks: [], text}],
  };
}

const defaultFestivalInfo: FestivalInfo = {
  kicker: "Gut vorbereitet",
  title: "Festival-Infos",
  intro: "Alles Wichtige für deinen Besuch bei Metal im Dorf: Anreise, Einlass, Versorgung und Hinweise zum Gelände.",
  sections: [
    {
      _key: "arrival",
      icon: "route",
      title: "Anreise & Gelände",
      body: [defaultTextBlock("arrival", "Metal im Dorf findet am Opfermoor Niederdorla, An der Oberrothe in 99988 Niederdorla statt. Aktuelle Hinweise zur Anfahrt findest du vor der Veranstaltung auf dieser Seite.")],
    },
    {
      _key: "parking",
      icon: "parking",
      title: "Parken & Camping",
      body: [defaultTextBlock("parking", "Informationen zu Parkflächen und Campingmöglichkeiten werden für jede Veranstaltung rechtzeitig bekanntgegeben.")],
    },
    {
      _key: "entry",
      icon: "ticket",
      title: "Tickets & Einlass",
      body: [defaultTextBlock("entry", "Vorverkauf, Abendkasse und Einlasszeiten können je nach Veranstaltung variieren. Maßgeblich sind die Angaben auf der jeweiligen Veranstaltungsseite.")],
    },
    {
      _key: "contact",
      icon: "contact",
      title: "Fragen & Barrierefreiheit",
      body: [defaultTextBlock("contact", "Wenn du Unterstützung benötigst oder Fragen zur Zugänglichkeit des Geländes hast, melde dich bitte vorab bei uns.")],
      linkLabel: "Kontakt aufnehmen",
      linkUrl: `mailto:${defaultSiteSettings.contact.email}`,
    },
  ],
};

export async function getFestivalInfo(): Promise<FestivalInfo> {
  const info = await loadQuery<Partial<FestivalInfo> | null>(
    groq`*[_type == "festivalInfo" && _id == "festivalInfo"][0] {
      kicker,
      title,
      intro,
      sections[] {
        _key,
        icon,
        title,
        body,
        linkLabel,
        linkUrl
      }
    }`,
  );

  return {
    ...defaultFestivalInfo,
    ...info,
    sections: info?.sections?.length ? info.sections as FestivalInfoSection[] : defaultFestivalInfo.sections,
  };
}

export async function getPosts(): Promise<Post[]> {
  return loadQuery<Post[]>(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc) {
      ...,
      mainImage ${imageProjection}
    }`,
  );
}

export async function getPost(slug: string): Promise<Post> {
  return loadQuery<Post>(
    groq`*[_type == "post" && slug.current == $slug][0] {
      ...,
      mainImage ${imageProjection},
      seo {
        ...,
        ogImage ${imageProjection}
      }
    }`,
    { slug },
  );
}

export interface SanityImage {
  _type: "image";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  caption?: string;
  /** Original image width in pixels, from asset metadata */
  width: number;
  /** Original image height in pixels, from asset metadata */
  height: number;
  /** Low-quality image placeholder (base64 data URL) */
  lqip?: string;
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
}

export interface Post {
  _id: string;
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: SanityImage;
  body: PortableTextBlock[];
  seo?: Seo;
}
export async function getBands(): Promise<Band[]> {
  return loadQuery<Band[]>(
    groq`*[_type == "band"] | order(spielzeit asc) {
      _id,
      name,
      genre,
      spielzeit,
      platzhalter,
      bild ${imageProjection}
    }`,
  );
}

export async function getNews(): Promise<News[]> {
  return loadQuery<News[]>(
    groq`*[_type == "news"] | order(datum desc, facebookQuelle.reihenfolge asc) {
      _id,
      titel,
      datum,
      bild ${imageProjection},
      bilder[] ${imageProjection},
      inhalt
    }`,
  );
}

export interface Band {
  _id: string;
  name?: string;
  genre?: string;
  spielzeit?: string;
  platzhalter?: boolean;
  bild?: SanityImage;
}

export interface Veranstaltung {
  _id: string;
  titel: string;
  slug?: Slug;
  kategorie: "hauptfestival" | "nebenveranstaltung";
  beginn: string;
  ende?: string;
  ort: string;
  adresse?: string;
  kurzbeschreibung?: string;
  beschreibung?: PortableTextBlock[];
  bild?: SanityImage;
  istAktuell?: boolean;
  ticketUrl?: string;
  ticketLabel?: string;
  mapUrl?: string;
  lineup?: Array<{
    _key: string;
    spielzeit?: string;
    band?: Band;
  }>;
}

export async function getCurrentEvent(): Promise<Veranstaltung | null> {
  return loadQuery<Veranstaltung | null>(
    groq`*[
      _type == "veranstaltung" &&
      (istAktuell == true || coalesce(ende, beginn) >= now())
    ] | order(istAktuell desc, beginn asc)[0] {
      _id,
      titel,
      slug,
      kategorie,
      beginn,
      ende,
      ort,
      adresse,
      kurzbeschreibung,
      beschreibung,
      bild ${imageProjection},
      istAktuell,
      ticketUrl,
      ticketLabel,
      mapUrl,
      lineup[] {
        _key,
        spielzeit,
        band-> {
          _id,
          name,
          genre,
          platzhalter,
          bild ${imageProjection}
        }
      }
    }`,
  );
}

export async function getUpcomingEvents(): Promise<Veranstaltung[]> {
  return loadQuery<Veranstaltung[]>(
    groq`*[
      _type == "veranstaltung" &&
      coalesce(ende, beginn) >= now()
    ] | order(beginn asc) {
      _id,
      titel,
      slug,
      kategorie,
      beginn,
      ende,
      ort,
      adresse,
      kurzbeschreibung,
      beschreibung,
      bild ${imageProjection},
      istAktuell,
      ticketUrl,
      ticketLabel,
      mapUrl
    }`,
  );
}

export async function getEvents(): Promise<Veranstaltung[]> {
  return loadQuery<Veranstaltung[]>(
    groq`*[_type == "veranstaltung"] | order(beginn asc) {
      _id,
      titel,
      slug,
      kategorie,
      beginn,
      ende,
      ort,
      adresse,
      kurzbeschreibung,
      beschreibung,
      bild ${imageProjection},
      istAktuell,
      ticketUrl,
      ticketLabel,
      mapUrl,
      lineup[] {
        _key,
        spielzeit,
        band-> {
          _id,
          name,
          genre,
          platzhalter,
          bild ${imageProjection}
        }
      }
    }`,
  );
}

export async function getCurrentLineup(): Promise<{event: Veranstaltung | null; bands: Band[]}> {
  const event = await getCurrentEvent();
  const eventBands = event?.lineup
    ?.filter((slot): slot is typeof slot & {band: Band} => Boolean(slot.band))
    .map((slot) => ({...slot.band, spielzeit: slot.spielzeit}));

  return {
    event,
    bands: eventBands?.length ? eventBands : await getBands(),
  };
}

export interface News {
  _id: string;
  titel: string;
  datum?: string;
  bild?: SanityImage;
  bilder?: SanityImage[];
  inhalt?: PortableTextBlock[];
}

export async function getHistorie(): Promise<Historie[]> {
  return loadQuery<Historie[]>(
    groq`*[_type == "historie"] | order(jahr desc) {
      _id,
      jahr,
      titel,
      slug,
      "kategorie": coalesce(kategorie, "hauptfestival"),
      plakat ${imageProjection},
      beschreibung,
      bilder[] ${imageProjection}
    }`,
  );
}

export interface Historie {
  _id: string;
  jahr: number;
  titel?: string;
  slug?: Slug;
  kategorie: "hauptfestival" | "nebenveranstaltung";
  plakat?: SanityImage;
  beschreibung?: PortableTextBlock[];
  bilder?: SanityImage[];
}
