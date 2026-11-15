// Strukturierte Daten (schema.org als JSON-LD): Damit können Google und Co. Termine als Event-Karte
// und den Veranstalter mit Logo und Social-Media-Profilen direkt in den Suchergebnissen zeigen.
// Prüfen lässt sich das Ergebnis mit https://search.google.com/test/rich-results

import { imageUrl } from "./image";
import { ticketLink, type BandLinkKey, type Veranstaltung } from "./sanity";
import { ADDRESS, SITE_NAME, siteUrl, type SiteSettings } from "./site";

const TIME_ZONE = "Europe/Berlin";

/** Zeitpunkt mit deutscher Uhrzeit und Zeitzone, z. B. "2027-06-05T19:00:00+02:00". */
function berlinIso(date: Date, time?: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZoneName: "longOffset",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  const offset = parts.timeZoneName === "GMT" ? "+00:00" : parts.timeZoneName.replace("GMT", "");
  return `${parts.year}-${parts.month}-${parts.day}T${time ?? `${parts.hour}:${parts.minute}`}:00${offset}`;
}

/** "An der Oberrothe, 99986 Niederdorla" → Straße, PLZ und Ort einzeln. */
function postalAddress(address?: string, locality?: string) {
  const match = address?.match(/^(?:(.*?),\s*)?(\d{5})\s+(.+)$/);
  return {
    "@type": "PostalAddress",
    ...(match
      ? { ...(match[1] && { streetAddress: match[1] }), postalCode: match[2], addressLocality: match[3] }
      : address
        ? { streetAddress: address, ...(locality && { addressLocality: locality }) }
        : { addressLocality: locality }),
    addressRegion: "Thüringen",
    addressCountry: "DE",
  };
}

/** Erste Zahl aus dem Eintrittsfeld, z. B. "20 € Vorverkauf, Abendkasse erhöht" → "20". */
function priceOf(preis?: string) {
  if (!preis) return undefined;
  if (/frei|kostenlos/i.test(preis)) return "0";
  return preis.match(/\d+(?:[.,]\d{1,2})?/)?.[0].replace(",", ".");
}

const bandLinkOrder: BandLinkKey[] = ["website", "instagram", "facebook", "spotify", "bandcamp", "youtube"];

export function organization(settings: SiteSettings) {
  return {
    "@type": "Organization",
    "@id": siteUrl("/#veranstalter"),
    name: SITE_NAME,
    url: siteUrl(),
    logo: siteUrl("/apple-touch-icon.png"),
    email: settings.email,
    sameAs: [settings.instagramUrl, settings.facebookUrl].filter(Boolean),
  };
}

export function eventJsonLd(event: Veranstaltung, settings: SiteSettings) {
  // Ohne Ort (oder „Opfermoor“ ohne Adresse) findet die Veranstaltung am Opfermoor statt. Bei einem
  // anderen Ort ohne Adresse wird nur der Ortsname angegeben, damit nie eine falsche Adresse in der Suche steht.
  const atDefaultPlace = !event.adresse && (!event.ort || /opfermoor/i.test(event.ort));
  const start = new Date(event.beginn);
  const preis = priceOf(event.preis);
  const ticket = ticketLink(event);
  const performers = (event.bands ?? []).filter((band): band is NonNullable<typeof band> => Boolean(band?.name && !band.platzhalter));

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.titel,
    startDate: berlinIso(start),
    ...(event.ende && { endDate: berlinIso(new Date(event.ende)) }),
    ...(event.einlass && { doorTime: berlinIso(start, event.einlass) }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.ort || ADDRESS[0],
      address: atDefaultPlace ? postalAddress(ADDRESS[1]) : postalAddress(event.adresse, event.ort),
    },
    ...(event.bild && { image: [imageUrl(event.bild, 1200)] }),
    ...(event.kurzbeschreibung && { description: event.kurzbeschreibung }),
    ...((ticket || preis) && {
      offers: {
        "@type": "Offer",
        ...(ticket && { url: new URL(ticket.href, siteUrl()).href }),
        ...(preis && { price: preis, priceCurrency: "EUR" }),
        availability: "https://schema.org/InStock",
      },
    }),
    ...(performers.length && {
      performer: performers.map((band) => {
        const links = bandLinkOrder.map((key) => band.links?.[key]).filter(Boolean);
        return { "@type": "MusicGroup", name: band.name, ...(links.length && { sameAs: links }) };
      }),
    }),
    organizer: organization(settings),
    url: siteUrl("/veranstaltungen"),
  };
}

/** Als Text für <script type="application/ld+json">, sicher gegen "</script>" in Inhalten. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
