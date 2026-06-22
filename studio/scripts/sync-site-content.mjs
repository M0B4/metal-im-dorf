import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-22'}).withConfig({
  perspective: 'raw',
  useCdn: false,
})

const accentColor = {
  _type: 'color',
  alpha: 1,
  hex: '#00A8BB',
  hsl: {_type: 'hslaColor', h: 186.1, s: 1, l: 0.3667, a: 1},
  hsv: {_type: 'hsvaColor', h: 186.1, s: 1, v: 0.7333, a: 1},
  rgb: {_type: 'rgbaColor', r: 0, g: 168, b: 187, a: 1},
}

const accentTextColor = {
  _type: 'color',
  alpha: 1,
  hex: '#050505',
  hsl: {_type: 'hslaColor', h: 0, s: 0, l: 0.0196, a: 1},
  hsv: {_type: 'hsvaColor', h: 0, s: 0, v: 0.0196, a: 1},
  rgb: {_type: 'rgbaColor', r: 5, g: 5, b: 5, a: 1},
}

const defaults = {
  siteName: 'Metal im Dorf',
  defaultSeo: {
    title: 'Metal im Dorf',
    description: 'News, Veranstaltungen und aktuelle Infos vom Metal im Dorf Festival.',
  },
  hero: {
    kicker: 'Opfermoor, Vogtei',
    title: 'Metal im Dorf',
    intro:
      'Das kleine Metal-Festival am Opfermoor Vogtei: direkt, laut und ohne Umwege. Hier findest du aktuelle Ansagen, Bands und Rückblicke.',
    primaryButtonLabel: 'News lesen',
    secondaryButtonLabel: 'Line-Up ansehen',
    showPrimaryButton: true,
    showSecondaryButton: true,
    showNextEvent: true,
    nextEventLabel: 'Nächste Veranstaltung',
    eventDetailsLabel: 'Veranstaltungsdetails',
    ticketFallbackLabel: 'Tickets',
  },
  sections: {
    nextEvent: {
      kicker: 'Termine',
      title: 'Kommende Veranstaltungen',
      locationLabel: 'Ort',
      emptyText: 'Aktuell sind keine kommenden Veranstaltungen angekündigt.',
    },
    eventPosters: {
      kicker: 'Plakate',
      title: 'Kommende Veranstaltungen',
      description: 'Plakate und Termine der kommenden Metal im Dorf Veranstaltungen.',
      emptyText: 'Aktuell sind noch keine Veranstaltungsplakate verfügbar.',
    },
    news: {
      kicker: 'News',
      title: 'Aktuelles vom Festival',
      emptyText: 'Keine News verfügbar.',
      articleLabel: 'Artikel lesen',
      previousLabel: 'Vorherige Seite',
      nextLabel: 'Nächste Seite',
      pageLabel: 'Seite',
    },
    lineup: {
      kicker: 'Live & laut',
      title: 'Line-Up',
      intro: 'Die Bands für die aktuelle Veranstaltung.',
      showRunningOrder: false,
      runningOrderKicker: 'Live-Zeiten',
      runningOrderTitle: 'Running Order',
      runningOrderEmptyText: 'Die Running Order wird noch bekanntgegeben.',
      emptyText: 'Das Line-Up wird bald bekanntgegeben.',
      placeholderGenre: 'Ankündigung folgt',
      placeholderName: 'Wird noch bekannt gegeben',
      defaultGenre: 'Metal',
      unknownTime: 'TBA',
    },
    history: {
      kicker: 'Archiv',
      title: 'Historie',
      intro: 'Poster, Rückblicke und Impressionen vergangener Festivals und Nebenveranstaltungen.',
      emptyText: 'Keine Einträge in der Historie verfügbar.',
      allFilterLabel: 'Alle',
      mainFilterLabel: 'Hauptfestival',
      sideFilterLabel: 'Nebenveranstaltungen',
      filterEmptyText: 'In dieser Kategorie gibt es noch keine Einträge.',
    },
    eventDetail: {
      kicker: 'Veranstaltung',
      backLabel: 'Veranstaltungen',
      dateLabel: 'Termin',
      locationLabel: 'Ort',
      admissionLabel: 'Eintritt',
      routeLabel: 'Route',
      directionsLabel: 'Anfahrt',
      lineupKicker: 'Live',
      lineupTitle: 'Line-Up',
      infoKicker: 'Vor deinem Besuch',
      infoLabel: 'Anreise, Parken, Einlass und weitere Festival-Infos',
    },
    historyDetail: {
      backLabel: 'Zurück zur Übersicht',
      introTemplate: 'Impressionen und Archivmaterial vom Metal im Dorf {year}.',
      emptyText: 'Für dieses Jahr ist noch kein Rückblickstext vorhanden.',
      galleryKicker: 'Galerie',
      galleryTitle: 'Impressionen & Event-Fotos',
    },
    admin: {
      kicker: 'Verwaltung',
      title: 'Redaktionsbereich',
      intro: 'Hier geht es zur Verwaltung der Festivalinhalte.',
      buttonLabel: 'Sanity öffnen',
    },
  },
  navigation: {
    newsLabel: 'News',
    lineupLabel: 'Line-Up',
    eventsLabel: 'Veranstaltungen',
    infoLabel: 'Infos',
    historyLabel: 'Historie',
    legalLabel: 'Impressum',
    adminLabel: 'Adminbereich',
  },
  footer: {
    description:
      'Ein kleines, lautes Festival im Dorf: harte Riffs, kurze Wege und eine Community, die vor der Bühne zuhause ist.',
    navigationTitle: 'Navigation',
    contactTitle: 'Kontakt',
    socialTitle: 'Folge uns',
    copyright: 'Metal im Dorf',
  },
  contact: {
    email: 'metalimdorf@gmx.de',
    address: ['Opfermoor Niederdorla', 'An der Oberrothe, 99988 Niederdorla'],
    instagramUrl: 'https://www.instagram.com/metalimdorf',
    facebookUrl: 'https://www.facebook.com/metalimdorf',
    showInstagram: true,
    showFacebook: true,
    studioUrl: 'https://metal-im-dorf.sanity.studio/',
  },
  notice: {
    enabled: false,
    text: 'Wichtiger Hinweis zum Festival',
    linkLabel: 'Mehr erfahren',
    linkUrl: '/infos',
  },
}

function mergeKnown(defaultValue, currentValue) {
  if (Array.isArray(defaultValue)) return Array.isArray(currentValue) ? currentValue : defaultValue
  if (!defaultValue || typeof defaultValue !== 'object') {
    return currentValue === undefined || currentValue === null ? defaultValue : currentValue
  }

  return Object.fromEntries(
    Object.entries(defaultValue).map(([key, value]) => [
      key,
      mergeKnown(value, currentValue?.[key]),
    ]),
  )
}

function textBlock(key, text) {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_key: `${key}-text`, _type: 'span', marks: [], text}],
  }
}

const current = (await client.getDocument('siteSettings')) || {}
const settings = mergeKnown(defaults, current)
const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  ...settings,
  accentColorPicker: accentColor,
  accentTextColorPicker: accentTextColor,
  ...(current.logo ? {logo: current.logo} : {}),
  defaultSeo: {
    ...settings.defaultSeo,
    ...(current.defaultSeo?.image ? {image: current.defaultSeo.image} : {}),
  },
  hero: {
    ...settings.hero,
    ...(current.hero?.image ? {image: current.hero.image} : {}),
  },
}

const festivalInfoDefaults = {
  _id: 'festivalInfo',
  _type: 'festivalInfo',
  kicker: 'Gut vorbereitet',
  title: 'Festival-Infos',
  intro:
    'Alles Wichtige für deinen Besuch bei Metal im Dorf: Anreise, Einlass, Versorgung und Hinweise zum Gelände.',
  sections: [
    {
      _key: 'arrival',
      _type: 'infoSection',
      icon: 'route',
      title: 'Anreise & Gelände',
      body: [
        textBlock(
          'arrival',
          'Metal im Dorf findet am Opfermoor Niederdorla, An der Oberrothe in 99988 Niederdorla statt. Aktuelle Hinweise zur Anfahrt findest du vor der Veranstaltung auf dieser Seite.',
        ),
      ],
    },
    {
      _key: 'parking',
      _type: 'infoSection',
      icon: 'parking',
      title: 'Parken & Camping',
      body: [
        textBlock(
          'parking',
          'Informationen zu Parkflächen und Campingmöglichkeiten werden für jede Veranstaltung rechtzeitig bekanntgegeben.',
        ),
      ],
    },
    {
      _key: 'entry',
      _type: 'infoSection',
      icon: 'ticket',
      title: 'Tickets & Einlass',
      body: [
        textBlock(
          'entry',
          'Vorverkauf, Abendkasse und Einlasszeiten können je nach Veranstaltung variieren. Maßgeblich sind die Angaben auf der jeweiligen Veranstaltungsseite.',
        ),
      ],
      linkLabel: 'Veranstaltungen ansehen',
      linkUrl: '/veranstaltungen',
    },
    {
      _key: 'contact',
      _type: 'infoSection',
      icon: 'contact',
      title: 'Fragen & Barrierefreiheit',
      body: [
        textBlock(
          'contact',
          'Wenn du Unterstützung benötigst oder Fragen zur Zugänglichkeit des Geländes hast, melde dich bitte vorab bei uns.',
        ),
      ],
      linkLabel: 'Kontakt aufnehmen',
      linkUrl: 'mailto:metalimdorf@gmx.de',
    },
  ],
}

const events = await client.fetch('*[_type == "veranstaltung"]{_id, slug, adresse, kurzbeschreibung}')
const currentInfo = await client.getDocument('festivalInfo')
const festivalInfo = currentInfo
  ? {
      _id: 'festivalInfo',
      _type: 'festivalInfo',
      kicker: currentInfo.kicker || festivalInfoDefaults.kicker,
      title: currentInfo.title || festivalInfoDefaults.title,
      intro: currentInfo.intro || festivalInfoDefaults.intro,
      sections: currentInfo.sections?.length ? currentInfo.sections : festivalInfoDefaults.sections,
    }
  : festivalInfoDefaults
const transaction = client.transaction().createOrReplace(siteSettings).createOrReplace(festivalInfo)

for (const event of events) {
  const slug = event.slug?.current
  if (slug === 'metal-im-dorf-vi') {
    const missing = {}
    if (!event.adresse) missing.adresse = 'An der Oberrothe, 99988 Niederdorla'
    if (!event.kurzbeschreibung) {
      missing.kurzbeschreibung =
        'Metal im Dorf VI am Opfermoor Niederdorla: ein kleines Festival mit schweren Riffs und kurzen Wegen.'
    }
    if (Object.keys(missing).length) transaction.patch(event._id, patch => patch.set(missing))
  }
  if (slug === 'iron-maiden-tribute') {
    if (!event.kurzbeschreibung) {
      transaction.patch(event._id, patch =>
        patch.set({
          kurzbeschreibung:
            'Iron-Maiden-Tribute in der Gemeindeschänke Langula – ein lauter Abend als Nebenveranstaltung von Metal im Dorf.',
        }),
      )
    }
  }
}

const bands = await client.fetch('*[_type == "band" && defined(spielzeit)]._id')
for (const id of bands) transaction.patch(id, patch => patch.unset(['spielzeit']))

const quickNews = await client.fetch('*[_type == "news" && defined(facebookSchnelleingabe)]._id')
for (const id of quickNews) {
  transaction.patch(id, patch => patch.unset(['facebookSchnelleingabe']))
}

const result = await transaction.commit({visibility: 'sync'})
console.log(
  `Synchronisiert: Website-Einstellungen, Festival-Infos, ${events.length} Veranstaltungen, ${bands.length} alte Band-Spielzeiten und ${quickNews.length} temporäre News-Eingaben.`,
)
console.log(`Transaktion: ${result.transactionId}`)
