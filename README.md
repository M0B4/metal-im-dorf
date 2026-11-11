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

Ein Push auf `master` veröffentlicht die Website über `.github/workflows/deploy.yml`. Das Studio wird mit `npm run deploy -w studio` aktualisiert.

### Umzug zu Cloudflare Pages

Der Build erkennt Cloudflare an `CF_PAGES` bzw. `WORKERS_CI` und baut dann ohne Unterordner `/metal-im-dorf`. Die Datenschutzerklärung nennt automatisch Cloudflare statt GitHub als Hoster, robots.txt und Sitemap zeigen auf die richtige Adresse. Einstellungen im Cloudflare-Projekt: Build-Befehl `npm run build -w frontend`, Ausgabeordner `frontend/dist`, Umgebungsvariable `SITE_URL` mit der endgültigen Adresse (z. B. `https://metal-im-dorf.de`). Vor dem Livegang den Vertrag zur Auftragsverarbeitung von Cloudflare im Dashboard bestätigen.

### Sofort veröffentlichen (optional)

Ohne Zusatz baut GitHub die Seite alle zehn Minuten neu. Für sofortige Updates in Sanity unter *API → Webhooks* einen Webhook für veröffentlichte Dokumente anlegen:

- URL: `https://api.github.com/repos/M0B4/metal-im-dorf/dispatches`
- Header: `Authorization: Bearer <GitHub-Token mit Zugriff auf Actions>` und `Accept: application/vnd.github+json`
- Payload: `{ "event_type": "sanity-content-update" }`
