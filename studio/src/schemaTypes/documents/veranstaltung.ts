import {defineArrayMember, defineField, defineType} from 'sanity'

const kategorien = [
  {title: 'Hauptfestival', value: 'hauptfestival'},
  {title: 'Nebenveranstaltung', value: 'nebenveranstaltung'},
]

// Alle Veranstaltungen, frühere wie kommende. Das Datum entscheidet: kommende stehen oben auf der
// Seite „Veranstaltungen“, vergangene wandern automatisch mit Plakat und Jahr in den Rückblick.
// Bei alten Veranstaltungen ohne genaues Datum reicht der 1. Januar des Jahres.
export default defineType({
  name: 'veranstaltung',
  title: 'Veranstaltung',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kategorie',
      title: 'Art',
      type: 'string',
      initialValue: 'hauptfestival',
      options: {layout: 'radio', direction: 'horizontal', list: kategorien},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'beginn',
      title: 'Beginn',
      type: 'datetime',
      options: {dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ende',
      title: 'Ende',
      description: 'Optional, z. B. bei mehrtägigen Veranstaltungen.',
      type: 'datetime',
      options: {dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm'},
      validation: (rule) =>
        rule.custom((ende, context) => {
          const beginn = (context.document as {beginn?: string} | undefined)?.beginn
          return !ende || !beginn || ende >= beginn ? true : 'Das Ende muss nach dem Beginn liegen.'
        }),
    }),
    defineField({
      name: 'einlass',
      title: 'Einlass',
      description: 'Optional, z. B. 17:00',
      type: 'string',
      validation: (rule) =>
        rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/).error('Bitte als HH:MM eingeben, z. B. 17:00.'),
    }),
    defineField({name: 'ort', title: 'Ort', description: 'Für kommende Veranstaltungen.', type: 'string'}),
    defineField({name: 'adresse', title: 'Adresse', description: 'Optional, für den Karten-Link.', type: 'string'}),
    defineField({name: 'bild', title: 'Plakat', type: 'image'}),
    defineField({name: 'kurzbeschreibung', title: 'Kurzer Text', description: 'Optional.', type: 'text', rows: 3}),
    defineField({
      name: 'preis',
      title: 'Eintritt',
      description: 'Optional, z. B. „25 € Vorverkauf, 30 € Abendkasse“ oder „Eintritt frei“.',
      type: 'string',
    }),
    defineField({
      name: 'vorverkauf',
      title: 'Tickets',
      description: 'Wie es Tickets gibt. Davon hängt der Ticket-Button auf der Website ab.',
      type: 'string',
      initialValue: 'formular',
      options: {
        layout: 'radio',
        list: [
          {title: 'Bestellung über die Website (Formular)', value: 'formular'},
          {title: 'Externer Ticketshop (Link)', value: 'extern'},
          {title: 'Nur Abendkasse', value: 'abendkasse'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Link zum Ticketshop',
      type: 'url',
      hidden: ({document}) => document?.vorverkauf !== 'extern',
      validation: (rule) =>
        rule.custom((url, context) =>
          (context.document as {vorverkauf?: string} | undefined)?.vorverkauf !== 'extern' || url
            ? true
            : 'Bitte den Link zum Ticketshop eintragen.',
        ),
    }),
    defineField({
      name: 'lineup',
      title: 'Line-Up',
      description: 'Erscheint auf der Seite „Line-Up“ für die nächste Veranstaltung. Reihenfolge per Ziehen ändern.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'lineupSlot',
          title: 'Auftritt',
          type: 'object',
          fields: [
            defineField({
              name: 'band',
              title: 'Band',
              type: 'reference',
              to: [{type: 'band'}],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'spielzeit',
              title: 'Spielzeit',
              description: 'Optional, z. B. 18:30',
              type: 'string',
              validation: (rule) =>
                rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/).error('Bitte als HH:MM eingeben, z. B. 18:30.'),
            }),
          ],
          preview: {
            select: {title: 'band.name', subtitle: 'spielzeit', media: 'band.bild'},
            prepare: ({title, subtitle, media}) => ({
              title: title || 'Band auswählen',
              subtitle: subtitle ? `${subtitle} Uhr` : undefined,
              media,
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [
    {title: 'Datum, neueste zuerst', name: 'beginnDesc', by: [{field: 'beginn', direction: 'desc'}]},
    {title: 'Datum, älteste zuerst', name: 'beginnAsc', by: [{field: 'beginn', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'titel', beginn: 'beginn', ort: 'ort', media: 'bild'},
    prepare: ({title, beginn, ort, media}) => ({
      title: title || 'Ohne Namen',
      subtitle: [beginn && new Date(beginn).toLocaleDateString('de-DE'), ort].filter(Boolean).join(' · '),
      media,
    }),
  },
})
