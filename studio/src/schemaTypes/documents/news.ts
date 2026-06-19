import {defineField, defineType} from 'sanity'

const imageField = {
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternativer Text',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Bildtitel / Caption',
      type: 'string',
    }),
  ],
}

export default defineType({
  name: 'news',
  title: 'News & Ankündigungen',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
    }),
    defineField({
      name: 'bild',
      title: 'Bild',
      ...imageField,
    }),
    defineField({
      name: 'bilder',
      title: 'Weitere Bilder',
      type: 'array',
      of: [imageField],
    }),
    defineField({
      name: 'inhalt',
      title: 'Inhalt',
      type: 'array',
      of: [
        {type: 'block'},
        imageField,
      ],
    }),
    defineField({
      name: 'facebookQuelle',
      title: 'Facebook-Import',
      type: 'object',
      readOnly: true,
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'id', title: 'Facebook-ID', type: 'string'}),
        defineField({name: 'url', title: 'Originalbeitrag', type: 'url'}),
        defineField({name: 'likes', title: 'Likes beim Import', type: 'number'}),
        defineField({name: 'comments', title: 'Kommentare beim Import', type: 'number'}),
        defineField({name: 'shares', title: 'Geteilt beim Import', type: 'number'}),
        defineField({name: 'reihenfolge', title: 'Import-Reihenfolge', type: 'number'}),
        defineField({name: 'importiertAm', title: 'Importiert am', type: 'datetime'}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titel',
      subtitle: 'datum',
      media: 'bild',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Keine Überschrift',
        subtitle: selection.subtitle ? new Date(selection.subtitle).toLocaleDateString('de-DE') : 'Kein Datum',
        media: selection.media,
      };
    },
  },
})
