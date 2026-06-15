import {defineField, defineType} from 'sanity'

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
      name: 'plakat',
      title: 'Festival-Plakat',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'jahr',
      media: 'plakat',
    },
    prepare(selection) {
      return {
        title: selection.title ? selection.title.toString() : 'Kein Jahr angegeben',
        media: selection.media,
      }
    },
  },
})