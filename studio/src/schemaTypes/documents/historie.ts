import {defineField, defineType} from 'sanity'

// Plakate von früheren Veranstaltungen, die nicht als „Veranstaltung“ angelegt sind.
// Neue Veranstaltungen immer unter „Veranstaltungen“ anlegen, sie landen später automatisch im Rückblick.
export default defineType({
  name: 'historie',
  title: 'Archiv-Plakat',
  type: 'document',
  fields: [
    defineField({name: 'jahr', title: 'Jahr', type: 'number', validation: (rule) => rule.required().integer()}),
    defineField({name: 'titel', title: 'Name', description: 'Optional, sonst wird das Jahr gezeigt.', type: 'string'}),
    defineField({
      name: 'kategorie',
      title: 'Art',
      type: 'string',
      initialValue: 'hauptfestival',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Hauptfestival', value: 'hauptfestival'},
          {title: 'Nebenveranstaltung', value: 'nebenveranstaltung'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'plakat', title: 'Plakat', type: 'image'}),
  ],
  orderings: [{title: 'Neueste zuerst', name: 'jahrDesc', by: [{field: 'jahr', direction: 'desc'}]}],
  preview: {
    select: {titel: 'titel', jahr: 'jahr', kategorie: 'kategorie', media: 'plakat'},
    prepare: ({titel, jahr, kategorie, media}) => ({
      title: titel || String(jahr ?? 'Ohne Jahr'),
      subtitle: [jahr, kategorie === 'nebenveranstaltung' ? 'Nebenveranstaltung' : 'Hauptfestival']
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
