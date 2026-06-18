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
  fields: [
    defineField({
      name: 'jahr',
      title: 'Jahr',
      type: 'number',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'titel',
      title: 'Festival-Titel (optional)',
      description: 'Z.B. "10 Jahre Metal im Dorf". Falls leer, wird "Festival [Jahr]" angezeigt.',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: (document) => `${document.jahr || ''}-${document.titel || 'metal-im-dorf'}`,
        maxLength: 96,
      },
    }),
    defineField({
      name: 'kategorie',
      title: 'Kategorie',
      type: 'string',
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
      name: 'plakat',
      title: 'Festival-Plakat',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'beschreibung',
      title: 'Rückblick / Beschreibung',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'bilder',
      title: 'Bildergalerie / Event-Fotos',
      type: 'array',
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
