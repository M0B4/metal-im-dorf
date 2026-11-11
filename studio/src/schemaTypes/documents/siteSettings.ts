import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Startseite',
      type: 'object',
      fields: [
        defineField({name: 'intro', title: 'Text unter dem Logo', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'akzentfarbe',
      title: 'Akzentfarbe',
      description:
        'Farbe für Buttons, Linien und Hervorhebungen, z. B. passend zum Plakat des Jahres. Als Hex-Code wie #00a8bb (das bisherige Türkis). Leer = Türkis.',
      type: 'string',
      validation: (rule) =>
        rule.regex(/^#[0-9a-fA-F]{6}$/).error('Bitte als Hex-Code mit 6 Zeichen eingeben, z. B. #00a8bb.'),
    }),
    defineField({
      name: 'notice',
      title: 'Hinweisbanner',
      description: 'Farbiger Balken oben auf jeder Seite, z. B. bei Wetterwarnungen.',
      type: 'object',
      fields: [
        defineField({name: 'enabled', title: 'Banner anzeigen', type: 'boolean', initialValue: false}),
        defineField({name: 'text', title: 'Text', type: 'string'}),
        defineField({name: 'linkLabel', title: 'Linktext', description: 'Optional.', type: 'string'}),
        defineField({
          name: 'linkUrl',
          title: 'Link',
          description: 'Optional. Internetadresse oder Seite wie /infos',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Kontakt',
      type: 'object',
      fields: [
        defineField({name: 'email', title: 'E-Mail', type: 'string'}),
        defineField({name: 'instagramUrl', title: 'Instagram-Link', type: 'url'}),
        defineField({name: 'facebookUrl', title: 'Facebook-Link', type: 'url'}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Website-Einstellungen'})},
})
