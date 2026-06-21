import type {Veranstaltung} from "./sanity";
import {sitePath} from "./site";

export function getEventPath(event: Pick<Veranstaltung, "_id" | "slug">) {
  return sitePath(`/veranstaltungen/${event.slug?.current || event._id}`);
}

export function getEventMapUrl(event: Pick<Veranstaltung, "mapUrl" | "ort" | "adresse">) {
  if (event.mapUrl) return event.mapUrl;
  const destination = [event.ort, event.adresse].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
}
