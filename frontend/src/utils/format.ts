const TIME_ZONE = "Europe/Berlin";

function toDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** "4. Juni 2027" */
export function formatDate(value?: string) {
  const date = toDate(value);
  if (!date) return "";
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: TIME_ZONE });
}

/** "20:00 Uhr" für Datums-Zeitwerte oder "18:30"-Angaben aus der Running Order. */
export function formatTime(value?: string) {
  if (!value) return "";
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return `${value} Uhr`;
  const date = toDate(value);
  if (!date) return value;
  return `${date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE })} Uhr`;
}

export function yearOf(value: string) {
  return Number(new Intl.DateTimeFormat("de-DE", { year: "numeric", timeZone: TIME_ZONE }).format(new Date(value)));
}
