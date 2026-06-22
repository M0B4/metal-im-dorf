import {defineField, defineType} from 'sanity'
import NewsDocumentInput from '../../components/NewsDocumentInput'

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
  components: {input: NewsDocumentInput},
  groups: [
    {name: 'quick', title: 'Schnelleingabe'},
    {name: 'content', title: 'News', default: true},
    {name: 'media', title: 'Bilder'},
    {name: 'assignment', title: 'Zuordnung'},
    {name: 'import', title: 'Import-Details'},
  ],
  fields: [
    defineField({
      name: 'facebookSchnelleingabe',
      title: 'Facebook-Schnelleingabe',
      description:
        'Facebook-Text und heruntergeladene Bilder einfügen. Anschließend oben „Als News übernehmen“ wählen.',
      type: 'object',
      group: 'quick',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({
          name: 'url',
          title: 'Facebook-Link',
          type: 'url',
        }),
        defineField({
          name: 'text',
          title: 'Beitragstext',
          description: 'Die erste ausgefüllte Zeile wird als Titel verwendet.',
          type: 'text',
          rows: 8,
        }),
        defineField({
          name: 'datum',
          title: 'Datum',
          type: 'date',
          initialValue: () =>
            new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Berlin'}).format(new Date()),
        }),
        defineField({
          name: 'bilder',
          title: 'Bilder',
          description: 'Das erste Bild wird zum Hauptbild, alle weiteren zur Galerie.',
          type: 'array',
          options: {layout: 'grid'},
          of: [imageField],
        }),
      ],
    }),
    defineField({
      name: 'titel',
      title: 'Titel',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
      group: 'content',
    }),
    defineField({
      name: 'veranstaltung',
      title: 'Zugehörige Veranstaltung',
      type: 'reference',
      group: 'assignment',
      to: [{type: 'veranstaltung'}],
    }),
    defineField({
      name: 'bild',
      title: 'Bild',
      group: 'media',
      ...imageField,
    }),
    defineField({
      name: 'bilder',
      title: 'Weitere Bilder',
      type: 'array',
      group: 'media',
      of: [imageField],
    }),
    defineField({
      name: 'inhalt',
      title: 'Inhalt',
      type: 'array',
      group: 'content',
      of: [
        {type: 'block'},
        imageField,
      ],
    }),
    defineField({
      name: 'facebookQuelle',
      title: 'Facebook-Import',
      type: 'object',
      group: 'import',
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
