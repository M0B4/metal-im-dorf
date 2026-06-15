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
      validation: Rule => Rule.required(),
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
})