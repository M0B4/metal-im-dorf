import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {colorInput} from '@sanity/color-input'
import {defineDocuments, defineLocations, presentationTool} from 'sanity/presentation'
import {schemaTypes} from './src/schemaTypes'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'hrgrzj9i'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// Presentation Preview URL
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321'

export default defineConfig({
  name: 'metal-im-dorf',
  title: 'Metal im Dorf',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Metal im Dorf')
          .items([
            S.listItem()
              .title('Website-Einstellungen')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            ...S.documentTypeListItems().filter(item => item.getId() !== 'siteSettings'),
          ]),
    }),
    presentationTool({
      previewUrl,
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: () => '_id == "siteSettings"',
          },
        ]),
        locations: {
          siteSettings: defineLocations({
            select: {title: 'siteName'},
            resolve: doc => ({
              locations: [{title: doc?.title || 'Startseite', href: '/'}],
            }),
          }),
        },
      },
    }),
    visionTool(),
    codeInput(),
    colorInput(),
  ],
  schema: {types: schemaTypes},
  document: {
    newDocumentOptions: (previous, context) =>
      context.creationContext.type === 'global'
        ? previous.filter(template => template.templateId !== 'siteSettings')
        : previous,
    actions: (previous, context) =>
      context.schemaType === 'siteSettings'
        ? previous.filter(action =>
            ['publish', 'discardChanges', 'restore'].includes(action.action || ''),
          )
        : previous,
  },
})
