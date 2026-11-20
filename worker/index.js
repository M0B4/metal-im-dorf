// Liefert die statische Website aus und leitet www.metal-im-dorf.de auf metal-im-dorf.de um,
// damit es nur eine Adresse gibt (gut für Suchmaschinen und geteilte Links).
const CANONICAL_HOST = "metal-im-dorf.de";

const OLD_PAGES = [
  [/^\/historie(\/|$)/, "/veranstaltungen/"],
  [/^\/news(\/|$)/, "/"],
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.href, 301);
    }
    // Seiten der alten Website gibt es nicht mehr: dauerhaft auf den passenden Ersatz umleiten,
    // damit Google sie nicht als „Nicht gefunden (404)“ meldet und Besucher alter Links ankommen.
    const replacement = OLD_PAGES.find(([pattern]) => pattern.test(url.pathname));
    if (replacement) return Response.redirect(new URL(replacement[1], url.origin).href, 301);
    return env.ASSETS.fetch(request);
  },
};
