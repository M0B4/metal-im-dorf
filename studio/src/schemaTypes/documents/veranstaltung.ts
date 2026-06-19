import {defineField, defineType, type StringRule} from 'sanity'

const timeValidation = (Rule: StringRule) =>
  Rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'Uhrzeit'})
    .error('Bitte eine gültige Uhrzeit im Format HH:MM eingeben.')

export default defineType({
  name: 'veranstaltung',
  title: 'Veranstaltungen',
  type: 'document',
  groups: [
    {name: 'details', title: 'Termin & Ort', default: true},
    {name: 'lineup', title: 'Line-up'},
    {name: 'website', title: 'Website'},
  ],
  fields: [
    defineField({
      name: 'titel',
      title: 'Name der Veranstaltung',
      type: 'string',
      group: 'details',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'details',
      options: {source: 'titel', maxLength: 96},
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'kategorie',
      title: 'Kategorie',
      type: 'string',
      group: 'details',
      initialValue: 'hauptfestival',
      options: {
        layout: 'radio',
        list: [
          {title: 'Hauptfestival', value: 'hauptfestival'},
          {title: 'Nebenveranstaltung', value: 'nebenveranstaltung'},
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'beginn',
      title: 'Beginn',
      type: 'datetime',
      group: 'details',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ende',
      title: 'Ende',
      type: 'datetime',
      group: 'details',
      validation: Rule =>
        Rule.custom((value, context) => {
          const begin = (context.document as {beginn?: string})?.beginn
          return !value || !begin || new Date(value) >= new Date(begin)
            ? true
            : 'Das Ende muss nach dem Beginn liegen.'
        }),
    }),
    defineField({
      name: 'ort',
      title: 'Veranstaltungsort',
      type: 'string',
      group: 'details',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'adresse',
      title: 'Adresse',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'kurzbeschreibung',
      title: 'Kurzbeschreibung',
      type: 'text',
      rows: 3,
      group: 'website',
    }),
    defineField({
      name: 'bild',
      title: 'Veranstaltungsbild',
      type: 'image',
      group: 'website',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternativer Text', type: 'string'})],
    }),
    defineField({
      name: 'istAktuell',
      title: 'Aktuelle Veranstaltung',
      description: 'Verknüpft diese Veranstaltung mit Startseite und Line-up-Seite.',
      type: 'boolean',
      group: 'website',
      initialValue: false,
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket- oder Informationslink',
      type: 'url',
      group: 'website',
    }),
    defineField({
      name: 'ticketLabel',
      title: 'Beschriftung des Links',
      type: 'string',
      group: 'website',
      initialValue: 'Mehr erfahren',
    }),
    defineField({
      name: 'lineup',
      title: 'Line-up & Running Order',
      description: 'Die Reihenfolge kann per Drag-and-drop geändert werden.',
      type: 'array',
      group: 'lineup',
      of: [
        defineField({
          name: 'lineupSlot',
          title: 'Auftritt',
          type: 'object',
          fields: [
            defineField({
              name: 'band',
              title: 'Band',
              type: 'reference',
              to: [{type: 'band'}],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'spielzeit',
              title: 'Spielzeit',
              description: 'Uhrzeit im Format HH:MM, zum Beispiel 18:30.',
              type: 'string',
              placeholder: '18:30',
              validation: timeValidation,
            }),
          ],
          preview: {
            select: {title: 'band.name', subtitle: 'spielzeit', media: 'band.bild'},
            prepare: ({title, subtitle, media}) => ({
              title: title || 'Band auswählen',
              subtitle: subtitle ? `${subtitle} Uhr` : 'Spielzeit offen',
              media,
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [
    {title: 'Termin, neu zuerst', name: 'dateDesc', by: [{field: 'beginn', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'titel', date: 'beginn', location: 'ort', current: 'istAktuell', media: 'bild'},
    prepare: ({title, date, location, current, media}) => ({
      title: `${current ? 'Aktuell · ' : ''}${title || 'Unbenannte Veranstaltung'}`,
      subtitle: [date ? new Date(date).toLocaleDateString('de-DE') : undefined, location]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
