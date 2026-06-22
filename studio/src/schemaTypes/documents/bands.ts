import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'band',
  title: 'Bands & Line-up',
  type: 'document',
  groups: [
    {name: 'details', title: 'Band', default: true},
    {name: 'media', title: 'Bild'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Bandname',
      type: 'string',
      group: 'details',
      validation: Rule => Rule.custom((name, context) => {
        const parent = context.parent as {platzhalter?: boolean} | undefined
        if (parent?.platzhalter) return true
        if (!name) return 'Bandname ist erforderlich'
        return true
      }),
    }),
    defineField({
      name: 'platzhalter',
      title: 'Platzhalter',
      description: 'Band wird noch angekündigt – zeigt eine Platzhalter-Karte im Line-Up.',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'bild',
      title: 'Bandfoto',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternativer Text', type: 'string'})],
    }),
  ],
  preview: {
    select: {
      name: 'name',
      genre: 'genre',
      platzhalter: 'platzhalter',
      media: 'bild',
    },
    prepare({name, genre, platzhalter, media}) {
      return {
        title: platzhalter ? (name || 'Platzhalter – noch nicht angekündigt') : name,
        subtitle: platzhalter ? 'Platzhalter' : genre,
        media,
      }
    },
  },
})
