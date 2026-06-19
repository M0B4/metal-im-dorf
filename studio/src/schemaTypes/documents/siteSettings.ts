import {defineField, defineType} from 'sanity'

const requiredText = (name: string, title: string, initialValue?: string) =>
  defineField({
    name,
    title,
    type: 'string',
    initialValue,
    validation: Rule => Rule.required(),
  })

const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: {hotspot: true},
    fields: [defineField({name: 'alt', title: 'Alternativer Text', type: 'string'})],
  })

export default defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  initialValue: {
    siteName: 'Metal im Dorf',
    accentColor: '#00A8BB',
    accentTextColor: '#050505',
    defaultSeo: {
      title: 'Metal im Dorf',
      description: 'News und aktuelle Infos vom Metal im Dorf Festival.',
    },
    hero: {
      kicker: 'Small festival, heavy sound',
      title: 'Metal im Dorf',
      intro:
        'Das kleine Metal-Festival am Opfermoor Niederdorla: direkt, laut und ohne Umwege. Hier findest du aktuelle Ansagen, Bands und Rückblicke.',
      primaryButtonLabel: 'News lesen',
      secondaryButtonLabel: 'Line-Up ansehen',
      showPrimaryButton: true,
      showSecondaryButton: true,
      showAnnouncement: true,
      announcementLabel: 'Aktuelle Meldung',
      emptyAnnouncementTitle: 'News folgen bald',
      emptyAnnouncementText: 'Bleib dran',
    },
    sections: {
      news: {
        kicker: 'News',
        title: 'Aktuelles vom Festival',
        emptyText: 'Keine News verfügbar.',
        expandLabel: 'Mehr anzeigen',
        collapseLabel: 'Weniger anzeigen',
        previousLabel: 'Zurück',
        nextLabel: 'Weiter',
        pageLabel: 'Seite',
      },
      lineup: {
        kicker: 'Live & laut',
        title: 'Line-Up',
        intro: 'Die Bands für das nächste Metal im Dorf.',
        emptyText: 'Das Line-Up wird bald bekanntgegeben.',
        placeholderGenre: 'Ankündigung folgt',
        placeholderName: 'Wird noch bekannt gegeben',
        defaultGenre: 'Metal',
        unknownTime: 'TBA',
      },
      history: {
        kicker: 'Archiv',
        title: 'Historie',
        intro:
          'Poster, Rückblicke und Impressionen vergangener Festivals und Nebenveranstaltungen.',
        emptyText: 'Keine Einträge in der Historie verfügbar.',
        allFilterLabel: 'Alle',
        mainFilterLabel: 'Hauptfestival',
        sideFilterLabel: 'Nebenveranstaltungen',
        filterEmptyText: 'In dieser Kategorie gibt es noch keine Einträge.',
      },
    },
    navigation: {
      newsLabel: 'News',
      lineupLabel: 'Line-Up',
      historyLabel: 'Historie',
      legalLabel: 'Impressum',
    },
    footer: {
      description:
        'Ein kleines, lautes Festival im Dorf: harte Riffs, kurze Wege und eine Community, die vor der Bühne zuhause ist.',
      navigationTitle: 'Navigation',
      contactTitle: 'Kontakt',
      socialTitle: 'Folge uns',
    },
    contact: {
      email: 'metalimdorf@gmx.de',
      address: ['Opfermoor Niederdorla', 'An der Oberrothe, 99988 Niederdorla'],
      instagramUrl: 'https://www.instagram.com/metalimdorf',
      facebookUrl: 'https://www.facebook.com/metalimdorf',
      showInstagram: true,
      showFacebook: true,
    },
  },
  groups: [
    {name: 'brand', title: 'Marke & SEO', default: true},
    {name: 'hero', title: 'Startbereich'},
    {name: 'sections', title: 'Bereiche'},
    {name: 'navigation', title: 'Navigation'},
    {name: 'footer', title: 'Footer & Kontakt'},
  ],
  fields: [
    defineField({...requiredText('siteName', 'Name der Website', 'Metal im Dorf'), group: 'brand'}),
    defineField({
      name: 'accentColor',
      title: 'Bisherige Highlight-Farbe',
      type: 'string',
      initialValue: '#00A8BB',
      group: 'brand',
      hidden: true,
      validation: Rule =>
        Rule.required().custom(value =>
          /^#[0-9a-fA-F]{6}$/.test(value || '') || 'Bitte einen Hex-Farbwert wie #00A8BB eingeben',
        ),
    }),
    defineField({
      name: 'accentColorPicker',
      title: 'Highlight-Farbe',
      description: 'Farbe auswählen oder als Hex-Wert eingeben.',
      type: 'color',
      group: 'brand',
      options: {disableAlpha: true},
    }),
    defineField({
      name: 'accentTextColor',
      title: 'Bisherige Textfarbe auf Highlights',
      type: 'string',
      initialValue: '#050505',
      group: 'brand',
      hidden: true,
      validation: Rule =>
        Rule.required().custom(value =>
          /^#[0-9a-fA-F]{6}$/.test(value || '') || 'Bitte einen Hex-Farbwert wie #050505 eingeben',
        ),
    }),
    defineField({
      name: 'accentTextColorPicker',
      title: 'Textfarbe auf Highlights',
      description: 'Für helle Highlights dunkel, für dunkle Highlights hell wählen.',
      type: 'color',
      group: 'brand',
      options: {disableAlpha: true},
    }),
    defineField({...imageField('logo', 'Logo'), group: 'brand'}),
    defineField({
      name: 'defaultSeo',
      title: 'Standard für Suchmaschinen',
      type: 'object',
      group: 'brand',
      fields: [
        requiredText('title', 'Seitentitel', 'Metal im Dorf'),
        defineField({
          name: 'description',
          title: 'Beschreibung',
          type: 'text',
          rows: 3,
          initialValue: 'News und aktuelle Infos vom Metal im Dorf Festival.',
        }),
        imageField('image', 'Vorschaubild beim Teilen'),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero auf der Startseite',
      type: 'object',
      group: 'hero',
      fields: [
        imageField('image', 'Hintergrundbild'),
        requiredText('kicker', 'Kleine Überschrift', 'Small festival, heavy sound'),
        requiredText('title', 'Hauptüberschrift', 'Metal im Dorf'),
        defineField({
          name: 'intro',
          title: 'Einleitung',
          type: 'text',
          rows: 3,
          initialValue:
            'Das kleine Metal-Festival am Opfermoor Niederdorla: direkt, laut und ohne Umwege. Hier findest du aktuelle Ansagen, Bands und Rückblicke.',
        }),
        requiredText('primaryButtonLabel', 'Text des News-Buttons', 'News lesen'),
        requiredText('secondaryButtonLabel', 'Text des Line-up-Buttons', 'Line-Up ansehen'),
        defineField({
          name: 'showPrimaryButton',
          title: 'News-Button anzeigen',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showSecondaryButton',
          title: 'Line-up-Button anzeigen',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showAnnouncement',
          title: 'Aktuelle Meldung anzeigen',
          type: 'boolean',
          initialValue: true,
        }),
        requiredText('announcementLabel', 'Überschrift der Meldungsbox', 'Aktuelle Meldung'),
        requiredText('emptyAnnouncementTitle', 'Meldungsbox ohne News', 'News folgen bald'),
        requiredText('emptyAnnouncementText', 'Hinweis ohne News', 'Bleib dran'),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Überschriften der Bereiche',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({
          name: 'news',
          title: 'News',
          type: 'object',
          fields: [
            requiredText('kicker', 'Kleine Überschrift', 'News'),
            requiredText('title', 'Überschrift', 'Aktuelles vom Festival'),
            requiredText('emptyText', 'Text ohne Einträge', 'Keine News verfügbar.'),
            requiredText('expandLabel', 'Text zum Aufklappen', 'Mehr anzeigen'),
            requiredText('collapseLabel', 'Text zum Einklappen', 'Weniger anzeigen'),
            requiredText('previousLabel', 'Vorherige News-Seite', 'Zurück'),
            requiredText('nextLabel', 'Nächste News-Seite', 'Weiter'),
            requiredText('pageLabel', 'Bezeichnung der Seitenzahl', 'Seite'),
          ],
        }),
        defineField({
          name: 'lineup',
          title: 'Line-Up',
          type: 'object',
          fields: [
            requiredText('kicker', 'Kleine Überschrift', 'Live & laut'),
            requiredText('title', 'Überschrift', 'Line-Up'),
            defineField({name: 'intro', title: 'Einleitung', type: 'text', rows: 2}),
            requiredText('emptyText', 'Text ohne Einträge', 'Das Line-Up wird bald bekanntgegeben.'),
            requiredText('placeholderGenre', 'Text für offenen Slot', 'Ankündigung folgt'),
            requiredText('placeholderName', 'Name für offenen Slot', 'Wird noch bekannt gegeben'),
            requiredText('defaultGenre', 'Genre ohne Angabe', 'Metal'),
            requiredText('unknownTime', 'Spielzeit ohne Angabe', 'TBA'),
          ],
        }),
        defineField({
          name: 'history',
          title: 'Historie',
          type: 'object',
          fields: [
            requiredText('kicker', 'Kleine Überschrift', 'Archiv'),
            requiredText('title', 'Überschrift', 'Historie'),
            defineField({
              name: 'intro',
              title: 'Einleitung',
              type: 'text',
              rows: 2,
              initialValue:
                'Poster, Rückblicke und Impressionen vergangener Festivals und Nebenveranstaltungen.',
            }),
            requiredText('emptyText', 'Text ohne Einträge', 'Keine Einträge in der Historie verfügbar.'),
            requiredText('allFilterLabel', 'Filter: Alle', 'Alle'),
            requiredText('mainFilterLabel', 'Filter: Hauptfestival', 'Hauptfestival'),
            requiredText(
              'sideFilterLabel',
              'Filter: Nebenveranstaltungen',
              'Nebenveranstaltungen',
            ),
            requiredText(
              'filterEmptyText',
              'Text bei leerem Filter',
              'In dieser Kategorie gibt es noch keine Einträge.',
            ),
          ],
        }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Beschriftung der Navigation',
      type: 'object',
      group: 'navigation',
      fields: [
        requiredText('newsLabel', 'News', 'News'),
        requiredText('lineupLabel', 'Line-Up', 'Line-Up'),
        requiredText('historyLabel', 'Historie', 'Historie'),
        requiredText('legalLabel', 'Impressum', 'Impressum'),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({
          name: 'description',
          title: 'Kurzbeschreibung',
          type: 'text',
          rows: 3,
          initialValue:
            'Ein kleines, lautes Festival im Dorf: harte Riffs, kurze Wege und eine Community, die vor der Bühne zuhause ist.',
        }),
        requiredText('navigationTitle', 'Überschrift Navigation', 'Navigation'),
        requiredText('contactTitle', 'Überschrift Kontakt', 'Kontakt'),
        requiredText('socialTitle', 'Überschrift Social Media', 'Folge uns'),
        defineField({name: 'copyright', title: 'Copyright-Text', type: 'string'}),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Kontakt & Social Media',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({name: 'email', title: 'E-Mail', type: 'string', validation: Rule => Rule.email()}),
        defineField({name: 'address', title: 'Adresse', type: 'array', of: [{type: 'string'}]}),
        defineField({name: 'instagramUrl', title: 'Instagram-Link', type: 'url'}),
        defineField({
          name: 'showInstagram',
          title: 'Instagram anzeigen',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({name: 'facebookUrl', title: 'Facebook-Link', type: 'url'}),
        defineField({
          name: 'showFacebook',
          title: 'Facebook anzeigen',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Website-Einstellungen'}),
  },
})
