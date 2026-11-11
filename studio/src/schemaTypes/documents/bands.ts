import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'band',
  title: 'Band',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Bandname',
      type: 'string',
      validation: (rule) =>
        rule.custom((name, context) =>
          name || (context.document as {platzhalter?: boolean} | undefined)?.platzhalter
            ? true
            : 'Bitte einen Bandnamen eingeben.',
        ),
    }),
    defineField({
      name: 'platzhalter',
      title: 'Noch geheim',
      description: 'Zeigt im Line-Up „Wird noch bekannt gegeben“ statt Name und Bild.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'genre', title: 'Genre', type: 'string'}),
    defineField({
      name: 'link',
      title: 'Link zum Reinhören',
      description: 'Optional, z. B. Bandcamp, YouTube, Spotify oder Instagram. Der Bandname im Line-Up verlinkt dorthin.',
      type: 'url',
    }),
    defineField({name: 'bild', title: 'Bandfoto', type: 'image', options: {hotspot: true}}),
  ],
  preview: {
    select: {name: 'name', genre: 'genre', platzhalter: 'platzhalter', media: 'bild'},
    prepare: ({name, genre, platzhalter, media}) => ({
      title: name || 'Noch geheim',
      subtitle: platzhalter ? 'Noch geheim' : genre,
      media,
    }),
  },
})
