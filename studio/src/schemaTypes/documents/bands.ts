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
      name: 'links',
      title: 'Links',
      description: 'Alle optional. Erscheinen im Line-Up als kleine Icons unter dem Bandnamen.',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'website', title: 'Website', type: 'url'}),
        defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
        defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
        defineField({name: 'spotify', title: 'Spotify', type: 'url'}),
        defineField({name: 'bandcamp', title: 'Bandcamp', type: 'url'}),
        defineField({name: 'youtube', title: 'YouTube', type: 'url'}),
      ],
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
