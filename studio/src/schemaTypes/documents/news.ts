import {defineArrayMember, defineField, defineType} from 'sanity'

const today = () => new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Berlin'}).format(new Date())

// So einfach wie möglich: Überschrift, Datum, Text und optional Bilder. Fertig.
export default defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Überschrift',
      type: 'string',
      validation: (rule) => rule.required().error('Bitte eine Überschrift eingeben.'),
    }),
    defineField({
      name: 'datum',
      title: 'Datum',
      description: 'Ist automatisch heute. Die neueste News steht auf der Website oben.',
      type: 'date',
      options: {dateFormat: 'DD.MM.YYYY'},
      initialValue: today,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bild',
      title: 'Bild',
      description: 'Optional. Erscheint klein links neben dem Text, ein Klick vergrößert es.',
      type: 'image',
    }),
    defineField({
      name: 'inhalt',
      title: 'Text',
      description: 'Absätze mit einer Leerzeile trennen. Fett, kursiv und Links sind möglich.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [{title: 'Aufzählung', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Fett', value: 'strong'},
              {title: 'Kursiv', value: 'em'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'bilder',
      title: 'Weitere Bilder',
      description: 'Optional. Erscheinen, wenn man auf der Website „Zeige mehr“ klickt.',
      type: 'array',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          validation: (rule) =>
            rule.custom((image: {asset?: unknown} | undefined) =>
              image?.asset ? true : 'Bitte ein Bild hochladen oder den leeren Eintrag löschen.',
            ),
        }),
      ],
    }),
  ],
  orderings: [{title: 'Neueste zuerst', name: 'datumDesc', by: [{field: 'datum', direction: 'desc'}]}],
  preview: {
    select: {title: 'titel', datum: 'datum', media: 'bild'},
    prepare: ({title, datum, media}) => ({
      title: title || 'Ohne Überschrift',
      subtitle: datum ? new Date(datum).toLocaleDateString('de-DE') : undefined,
      media,
    }),
  },
})
