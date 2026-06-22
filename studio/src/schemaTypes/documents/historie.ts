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
  name: 'historie',
  title: 'Historie & Rückblick',
  type: 'document',
  groups: [
    {name: 'overview', title: 'Übersicht', default: true},
    {name: 'content', title: 'Rückblick'},
    {name: 'media', title: 'Plakat & Galerie'},
  ],
  fields: [
    defineField({
      name: 'jahr',
      title: 'Jahr',
      type: 'number',
      group: 'overview',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'titel',
      title: 'Festival-Titel (optional)',
      description: 'Z.B. "10 Jahre Metal im Dorf". Falls leer, wird "Festival [Jahr]" angezeigt.',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'overview',
      options: {
        source: (document) => `${document.jahr || ''}-${document.titel || 'metal-im-dorf'}`,
        maxLength: 96,
      },
    }),
    defineField({
      name: 'kategorie',
      title: 'Kategorie',
      type: 'string',
      group: 'overview',
      initialValue: 'hauptfestival',
      options: {
        layout: 'radio',
        list: [
          {title: 'Hauptfestival', value: 'hauptfestival'},
          {title: 'Nebenveranstaltung', value: 'nebenveranstaltung'},
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'veranstaltung',
      title: 'Zugehörige Veranstaltung',
      type: 'reference',
      group: 'overview',
      to: [{type: 'veranstaltung'}],
    }),
    defineField({
      name: 'plakat',
      title: 'Festival-Plakat',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternativer Text', type: 'string'})],
    }),
    defineField({
      name: 'beschreibung',
      title: 'Rückblick / Beschreibung',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'bilder',
      title: 'Bildergalerie / Event-Fotos',
      type: 'array',
      group: 'media',
      of: [imageField],
    }),
  ],
  preview: {
    select: {
      title: 'titel',
      subtitle: 'jahr',
      category: 'kategorie',
      media: 'plakat',
    },
    prepare(selection) {
      const {title, subtitle, category, media} = selection;
      const categoryLabel = category === 'nebenveranstaltung' ? 'Nebenveranstaltung' : 'Hauptfestival';
      return {
        title: title || (subtitle ? `Festival ${subtitle}` : 'Kein Jahr angegeben'),
        subtitle: [subtitle?.toString(), categoryLabel].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
