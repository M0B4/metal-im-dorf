// Liefert die statische Website aus und leitet www.metal-im-dorf.de auf metal-im-dorf.de um,
// damit es nur eine Adresse gibt (gut für Suchmaschinen und geteilte Links).
const CANONICAL_HOST = "metal-im-dorf.de";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.href, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
