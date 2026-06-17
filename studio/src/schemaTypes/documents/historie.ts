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
      media: 'plakat',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection;
      return {
        title: title || (subtitle ? `Festival ${subtitle}` : 'Kein Jahr angegeben'),
        subtitle: subtitle ? subtitle.toString() : '',
        media,
      }
    },
  },
})