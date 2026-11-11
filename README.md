# Metal im Dorf

Website und Redaktions-Studio für das Metal im Dorf Festival.

- **Website:** https://m0b4.github.io/metal-im-dorf (Astro, statisch, GitHub Pages)
- **Studio:** https://metal-im-dorf.sanity.studio (Sanity, hier werden Inhalte gepflegt)

## Inhalte pflegen

Im Studio gibt es:

- **News:** Überschrift, Datum (ist automatisch heute), Text und optional Bilder. Veröffentlichen, fertig.
- **Veranstaltungen:** mit Plakat. Kommende stehen oben auf der Seite „Veranstaltungen“, vergangene rutschen automatisch in den Rückblick. Das Line-Up der nächsten Veranstaltung erscheint auf der Seite „Line-Up“. Unter „Tickets“ wählst du, ob über das Formular der Website bestellt wird, über einen externen Ticketshop oder nur an der Abendkasse.
- **Bands:** für das Line-Up.
- **Festival-Infos** und **Website-Einstellungen** (Text auf der Startseite, Akzentfarbe, Hinweisbanner, Kontakt).

Veröffentlichte Inhalte sind spätestens nach zehn Minuten auf der Website.

## Entwickeln

```sh
npm install
npm run dev      # Website auf http://localhost:4321, Studio auf http://localhost:3333
npm run check    # Typprüfung
npm run build    # Website bauen (frontend/dist)
```

Ein Push auf `master` veröffentlicht die Website über Cloudflare Workers Builds. Das Studio wird mit `npm run deploy -w studio` aktualisiert.

### Cloudflare (metal-im-dorf.de)

Die Website läuft als Cloudflare Worker „metal-im-dorf“ (`wrangler.jsonc`, `worker/index.js`). Bei jedem Push auf `master` baut Workers Builds die Seite und veröffentlicht sie unter https://metal-im-dorf.de; www.metal-im-dorf.de leitet dorthin um. Der Build erkennt Cloudflare an `WORKERS_CI` und baut dann ohne Unterordner `/metal-im-dorf`, die Datenschutzerklärung nennt Cloudflare als Hoster. Den Vertrag zur Auftragsverarbeitung von Cloudflare im Dashboard bestätigen.

### Inhalte aus Sanity neu veröffentlichen

Änderungen in Sanity erscheinen erst nach einem neuen Build. Der Workflow `.github/workflows/deploy.yml` baut jeden Tag um 12 Uhr deutscher Zeit neu und lässt sich jederzeit unter *Actions → Website veröffentlichen → Run workflow* starten. Er braucht das Repository-Secret `CLOUDFLARE_API_TOKEN` (Cloudflare → My Profile → API Tokens → Vorlage „Edit Cloudflare Workers“).

Automatisch 30 Minuten nach der letzten Veröffentlichung in Sanity (weitere Änderungen in der Zeit verschieben den Neubau): unter sanity.io/manage → Projekt → *API → Webhooks* einen Webhook anlegen:

- URL: `https://api.github.com/repos/M0B4/metal-im-dorf/dispatches`, Methode `POST`, Dataset `production`
- Trigger on: Create, Update, Delete; Drafts nicht einschließen
- Projection: `{"event_type": "sanity-content-update"}`
- HTTP-Header: `Authorization: Bearer <GitHub-Token>` und `Accept: application/vnd.github+json`
- GitHub-Token: Fine-grained Token nur für dieses Repository mit der Berechtigung *Contents: Read and write*

Die alte Adresse m0b4.github.io/metal-im-dorf leitet per GitHub Pages auf metal-im-dorf.de um (`.github/redirect`).
