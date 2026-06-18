import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'band',
  title: 'Bands & Line-up',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Bandname',
      type: 'string',
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
      initialValue: false,
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'string',
    }),
    defineField({
      name: 'spielzeit',
      title: 'Spielzeit',
      type: 'datetime',
    }),
    defineField({
      name: 'bild',
      title: 'Bandfoto',
      type: 'image',
      options: {hotspot: true},
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
