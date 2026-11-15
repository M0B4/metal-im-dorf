import {defineArrayMember, defineField, defineType} from 'sanity'

// Texte der Seite /datenschutz. Der Abschnitt „Verantwortlich“ steht immer oben und kommt
// automatisch aus Website-Einstellungen → Impressum, damit die Angaben überall gleich sind.
export default defineType({
  name: 'datenschutz',
  title: 'Datenschutz',
  type: 'document',
  fields: [
    defineField({
      name: 'einleitung',
      title: 'Einleitung',
      description: 'Kurzer Satz unter der Überschrift.',
      type: 'string',
    }),
    defineField({
      name: 'abschnitte',
      title: 'Abschnitte',
      description:
        'Der Abschnitt „Verantwortlich“ mit Veranstalter, Anschrift und E-Mail steht immer zuerst und kommt aus den Website-Einstellungen. Reihenfolge per Drag-and-drop. Wichtig: Wenn sich an der Technik etwas ändert (anderer Hoster, Ticketformular über einen Dienst, eingebettete Videos oder Karten), muss der Text hier angepasst werden.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'abschnitt',
          title: 'Abschnitt',
          type: 'object',
          fields: [
            defineField({
              name: 'titel',
              title: 'Überschrift',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'block',
                  styles: [{title: 'Absatz', value: 'normal'}],
                  lists: [{title: 'Aufzählung', value: 'bullet'}],
                }),
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'titel'}},
        }),
      ],
    }),
    defineField({
      name: 'stand',
      title: 'Stand',
      description: 'Erscheint klein unter dem Text, z. B. „November 2026“.',
      type: 'string',
    }),
  ],
  preview: {prepare: () => ({title: 'Datenschutz'})},
})
