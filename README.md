# Metal im Dorf

Website und Redaktions-Studio für das Metal im Dorf Festival.

- **Website:** https://m0b4.github.io/metal-im-dorf (Astro, statisch, GitHub Pages)
- **Studio:** https://metal-im-dorf.sanity.studio (Sanity, hier werden Inhalte gepflegt)

## Inhalte pflegen

Im Studio gibt es:

- **News:** Überschrift, Datum (ist automatisch heute), Text und optional Bilder. Veröffentlichen, fertig.
- **Veranstaltungen:** mit Plakat. Kommende stehen oben auf der Seite „Veranstaltungen“, vergangene rutschen automatisch in den Rückblick. Das Line-Up der nächsten Veranstaltung erscheint auf der Seite „Line-Up“.
- **Bands:** für das Line-Up.
- **Festival-Infos** und **Website-Einstellungen** (Text auf der Startseite, Hinweisbanner, Kontakt).
- **Archiv: frühere Plakate:** nur für alte Jahre, die nicht als Veranstaltung angelegt sind.

Veröffentlichte Inhalte sind spätestens nach zehn Minuten auf der Website.

## Entwickeln

```sh
npm install
npm run dev      # Website auf http://localhost:4321, Studio auf http://localhost:3333
npm run check    # Typprüfung
npm run build    # Website bauen (frontend/dist)
```

Ein Push auf `master` veröffentlicht die Website über `.github/workflows/deploy.yml`. Das Studio wird mit `npm run deploy -w studio` aktualisiert.

### Sofort veröffentlichen (optional)

Ohne Zusatz baut GitHub die Seite alle zehn Minuten neu. Für sofortige Updates in Sanity unter *API → Webhooks* einen Webhook für veröffentlichte Dokumente anlegen:

- URL: `https://api.github.com/repos/M0B4/metal-im-dorf/dispatches`
- Header: `Authorization: Bearer <GitHub-Token mit Zugriff auf Actions>` und `Accept: application/vnd.github+json`
- Payload: `{ "event_type": "sanity-content-update" }`
