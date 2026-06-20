export function formatDate(date?: string) {
  if (!date) return "Aktuell";

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "Aktuell";

  return value.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const timeFormatter = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Berlin",
});

export function formatTime(value: string) {
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return `${value} Uhr`;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${timeFormatter.format(date)} Uhr`;
}

export function formatEventDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  }).format(date);
}

export function formatCompactEventDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Berlin",
  }).format(date);
}
