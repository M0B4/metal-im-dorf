import { sanityClient } from "sanity:client";
import type { PortableTextBlock } from "@portabletext/types";
import type { Slug } from "@sanity/types";
import groq from "groq";

const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
const token = import.meta.env.SANITY_API_READ_TOKEN;

// visualEditingEnabled=true: fetch draft content with stega encoding (local/staging with Presentation tool)
// Static builds must read the latest published content so newly added event pages
// are included immediately instead of waiting for the API CDN cache to refresh.
async function loadQuery<T>(query: string, params: Record<string, any> = {}): Promise<T> {
  return sanityClient.fetch<T>(
    query,
    params,
    {
      perspective: visualEditingEnabled ? 'drafts' : 'published',
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
    groq`*[_type == "news"] | order(datum desc) {
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
