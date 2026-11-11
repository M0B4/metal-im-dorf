import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './src/schemaTypes'

// Diese Dokumente gibt es nur einmal: sie öffnen direkt und können nicht neu angelegt werden.
const singletons = ['siteSettings', 'festivalInfo']

export default defineConfig({
  name: 'metal-im-dorf',
  title: 'Metal im Dorf',
  projectId: 'hrgrzj9i',
  dataset: 'production',
  plugins: [
    colorInput(),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalte')
          .items([
            S.listItem()
              .title('News')
              .schemaType('news')
              .child(
                S.documentTypeList('news')
                  .title('News')
                  .defaultOrdering([{field: 'datum', direction: 'desc'}]),
              ),
            S.listItem()
              .title('Veranstaltungen')
              .schemaType('veranstaltung')
              .child(
                S.documentTypeList('veranstaltung')
                  .title('Veranstaltungen')
                  .defaultOrdering([{field: 'beginn', direction: 'desc'}]),
              ),
            S.documentTypeListItem('band').title('Bands'),
            S.divider(),
            S.listItem()
              .title('Festival-Infos')
              .id('festivalInfo')
              .child(S.document().schemaType('festivalInfo').documentId('festivalInfo')),
            S.listItem()
              .title('Website-Einstellungen')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) =>
      singletons.includes(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
