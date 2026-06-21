import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'festivalInfo',
  title: 'Festival-Infos',
  type: 'document',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kleine Überschrift',
      type: 'string',
      initialValue: 'Gut vorbereitet',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Überschrift',
      type: 'string',
      initialValue: 'Festival-Infos',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Einleitung',
      type: 'text',
      rows: 3,
      initialValue:
        'Alles Wichtige für deinen Besuch bei Metal im Dorf: Anreise, Einlass, Versorgung und Hinweise zum Gelände.',
    }),
    defineField({
      name: 'sections',
      title: 'Informationsbereiche',
      description: 'Die Reihenfolge kann per Drag-and-drop geändert werden.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'infoSection',
          title: 'Informationsbereich',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Symbol',
              type: 'string',
              initialValue: 'info',
              options: {
                list: [
                  {title: 'Information', value: 'info'},
                  {title: 'Anreise', value: 'route'},
                  {title: 'Parken', value: 'parking'},
                  {title: 'Camping', value: 'camping'},
                  {title: 'Tickets & Einlass', value: 'ticket'},
                  {title: 'Essen & Getränke', value: 'food'},
                  {title: 'Regeln', value: 'rules'},
                  {title: 'Barrierefreiheit', value: 'accessibility'},
                  {title: 'Awareness & Sicherheit', value: 'safety'},
                  {title: 'Kontakt', value: 'contact'},
                ],
              },
            }),
            defineField({
              name: 'title',
              title: 'Überschrift',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Inhalt',
              type: 'array',
              of: [{type: 'block'}],
              validation: Rule => Rule.required(),
            }),
            defineField({name: 'linkLabel', title: 'Linktext', type: 'string'}),
            defineField({
              name: 'linkUrl',
              title: 'Link',
              description: 'Externe URL oder interner Pfad, zum Beispiel /veranstaltungen.',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'icon'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Festival-Infos'}),
  },
})
