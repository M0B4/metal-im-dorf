import type { Historie } from "./sanity";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getHistoriePath(item: Historie, entries: Historie[]) {
  const sameYear = entries.filter((entry) => entry.jahr === item.jahr);
  if (sameYear.length === 1) return item.jahr.toString();

  const eventName = slugify(item.titel || "");
  const basePath = [item.jahr, item.kategorie, eventName]
    .filter(Boolean)
    .join("-");
  const hasCollision = sameYear.some((entry) => {
    if (entry._id === item._id) return false;

    const entryName = slugify(entry.titel || "");
    return [entry.jahr, entry.kategorie, entryName]
      .filter(Boolean)
      .join("-") === basePath;
  });

  return hasCollision ? `${basePath}-${item._id.slice(-6)}` : basePath;
}

export function getKategorieLabel(kategorie: Historie["kategorie"]) {
  return kategorie === "nebenveranstaltung" ? "Nebenveranstaltung" : "Hauptfestival";
}
