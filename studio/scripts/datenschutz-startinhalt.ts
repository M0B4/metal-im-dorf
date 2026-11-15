// Einmalig: legt das Dokument „Datenschutz“ mit dem bisher fest eingebauten Text an
// (Stand Cloudflare-Hosting, Ticketformular per Mailprogramm). Überschreibt nichts, wenn es
// das Dokument schon gibt.
//   cd studio && npx sanity exec scripts/datenschutz-startinhalt.ts --with-user-token
import {getCliClient} from 'sanity/cli'

let n = 0
const key = () => `k${(n++).toString(36).padStart(4, '0')}`

type Teil = string | {text: string; href: string}

function absatz(...teile: Teil[]) {
  const markDefs: Array<{_key: string; _type: 'link'; href: string}> = []
  const children = teile.map((teil) => {
    if (typeof teil === 'string') return {_type: 'span', _key: key(), text: teil, marks: []}
    const linkKey = key()
    markDefs.push({_key: linkKey, _type: 'link', href: teil.href})
    return {_type: 'span', _key: key(), text: teil.text, marks: [linkKey]}
  })
  return {_type: 'block', _key: key(), style: 'normal', markDefs, children}
}

const abschnitt = (titel: string, ...text: ReturnType<typeof absatz>[]) => ({
  _type: 'abschnitt',
  _key: key(),
  titel,
  text,
})

const doc = {
  _id: 'datenschutz',
  _type: 'datenschutz',
  einleitung: 'Kurz gesagt: keine Cookies, kein Tracking, keine Werbung.',
  stand: 'November 2026',
  abschnitte: [
    abschnitt(
      'Hosting und Server-Logs',
      absatz(
        'Die Website wird über Cloudflare ausgeliefert, einen Dienst der Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA. Cloudflare betreibt dafür ein weltweites Netz von Servern; beim Aufruf einer Seite antwortet in der Regel ein Server in deiner Nähe. Dabei verarbeitet Cloudflare technisch notwendige Daten, insbesondere deine IP-Adresse, Datum und Uhrzeit, die aufgerufene Seite und Angaben zu Browser und Betriebssystem. Das ist nötig, um die Website schnell und sicher auszuliefern und gegen Angriffe und Missbrauch zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Cloudflare speichert diese Daten nur kurz; wir selbst werten sie nicht aus.',
      ),
      absatz(
        'Mit Cloudflare besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO). Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert, wodurch eine Übermittlung in die USA zulässig ist (Art. 45 DSGVO). Cloudflare Web Analytics und andere Auswertungen von Cloudflare nutzen wir nicht. Mehr dazu in der ',
        {text: 'Datenschutzerklärung von Cloudflare', href: 'https://www.cloudflare.com/de-de/privacypolicy/'},
        '.',
      ),
    ),
    abschnitt(
      'Bilder',
      absatz(
        'Plakate, Bandfotos und News-Bilder werden vom Bilder-Server (CDN) unseres Redaktionssystems Sanity geladen, betrieben von Sanity Inc., 1 Letterman Drive, Building D, Suite D3700, San Francisco, CA 94129, USA. Dabei wird deine IP-Adresse an Sanity übermittelt, damit die Bilder ausgeliefert werden können (Art. 6 Abs. 1 lit. f DSGVO). Mehr dazu in der ',
        {text: 'Datenschutzerklärung von Sanity', href: 'https://www.sanity.io/legal/privacy'},
        '.',
      ),
    ),
    abschnitt(
      'Cookies, Schriften und Tracking',
      absatz(
        'Diese Website setzt keine Cookies und verwendet keine Analyse- oder Werbedienste. Alle Schriften liegen auf unserem eigenen Webspace, es wird also nichts von Google Fonts oder ähnlichen Diensten nachgeladen.',
      ),
    ),
    abschnitt(
      'Links zu anderen Diensten',
      absatz(
        'Wir verlinken auf Instagram, Facebook, Google Maps und Ticketanbieter. Diese Inhalte sind nicht eingebettet: Daten fließen erst dann an den jeweiligen Anbieter, wenn du einen solchen Link anklickst. Dort gilt die Datenschutzerklärung des Anbieters.',
      ),
    ),
    abschnitt(
      'Kontakt per E-Mail',
      absatz(
        'Wenn du uns schreibst, nutzen wir deine Angaben nur, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b und f DSGVO), und löschen sie, sobald sie nicht mehr gebraucht werden.',
      ),
    ),
    abschnitt(
      'Ticketbestellung',
      absatz(
        'Über das Formular auf der Seite Tickets kannst du Tickets bestellen. Dafür fragen wir die Veranstaltung, die Anzahl, deinen Namen, deine E-Mail-Adresse und optional eine Nachricht ab. Wir nutzen diese Angaben nur, um deine Bestellung zu bearbeiten und uns wegen Bezahlung und Abholung bei dir zu melden (Art. 6 Abs. 1 lit. b DSGVO). Wir löschen sie, sobald die Veranstaltung vorbei ist und keine gesetzlichen Aufbewahrungspflichten mehr bestehen.',
      ),
      absatz(
        'Beim Absenden öffnet sich dein eigenes Mailprogramm mit einer fertigen E-Mail an uns. Über die Website selbst werden dabei keine Daten übertragen, erst wenn du die Mail abschickst, erhalten wir sie über deinen E-Mail-Anbieter.',
      ),
    ),
    abschnitt(
      'Deine Rechte',
      absatz(
        'Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten, auf Datenübertragbarkeit sowie auf Widerspruch gegen eine Verarbeitung nach Art. 6 Abs. 1 lit. f DSGVO. Schreib uns dazu einfach eine E-Mail.',
      ),
      absatz(
        'Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel beim Thüringer Landesbeauftragten für den Datenschutz und die Informationsfreiheit.',
      ),
    ),
  ],
}

const client = getCliClient({apiVersion: '2025-01-01'})
if (await client.getDocument('datenschutz')) {
  console.log('Das Dokument „Datenschutz“ gibt es schon, nichts geändert.')
} else {
  await client.createIfNotExists(doc)
  console.log('Dokument „Datenschutz“ mit dem bisherigen Text angelegt und veröffentlicht.')
}
