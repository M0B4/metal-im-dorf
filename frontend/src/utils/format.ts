export function formatDate(date?: string) {
  if (!date) return "Aktuell";

  return new Date(date).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
