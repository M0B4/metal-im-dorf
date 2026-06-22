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
const previewBasePath = (() => {
  try {
    const path = new URL(previewUrl).pathname.replace(/\/$/, '')
    return path === '/' ? '' : path
  } catch {
    return ''
  }
})()
const previewPath = (path = '') => `${previewBasePath}${path}` || '/'

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
            S.listItem().title('Website').child(
              S.list()
                .title('Website')
                .items([
                  S.listItem()
                    .title('Website-Einstellungen')
                    .id('siteSettings')
                    .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                  S.listItem()
                    .title('Festival-Infos')
                    .id('festivalInfo')
                    .child(S.document().schemaType('festivalInfo').documentId('festivalInfo')),
                ]),
            ),
            S.listItem().title('Veranstaltungen & Line-up').child(
              S.list()
                .title('Veranstaltungen & Line-up')
                .items([
                  S.documentTypeListItem('veranstaltung').title('Veranstaltungen'),
                  S.documentTypeListItem('band').title('Bands'),
                ]),
            ),
            S.listItem().title('News & Rückblicke').child(
              S.list()
                .title('News & Rückblicke')
                .items([
                  S.documentTypeListItem('news').title('News'),
                  S.documentTypeListItem('historie').title('Historie'),
                ]),
            ),
          ]),
    }),
    presentationTool({
      previewUrl,
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: previewPath('/'),
            filter: () => '_id == "siteSettings"',
          },
          {
            route: previewPath('/line-up'),
            filter: () => '_type == "veranstaltung" && istAktuell == true',
          },
        ]),
        locations: {
          siteSettings: defineLocations({
            select: {title: 'siteName'},
            resolve: doc => ({
              locations: [{title: doc?.title || 'Startseite', href: previewPath('/')}],
            }),
          }),
          festivalInfo: defineLocations({
            select: {title: 'title'},
            resolve: doc => ({
              locations: [{title: doc?.title || 'Festival-Infos', href: previewPath('/infos')}],
            }),
          }),
          veranstaltung: defineLocations({
            select: {title: 'titel', current: 'istAktuell', slug: 'slug.current', id: '_id'},
            resolve: doc => ({
              locations: [
                {title: 'Veranstaltungen', href: previewPath('/veranstaltungen')},
                ...(doc?.slug || doc?.id
                  ? [
                      {
                        title: doc?.title || 'Veranstaltung',
                        href: previewPath(`/veranstaltungen/${doc?.slug || doc?.id}`),
                      },
                    ]
                  : []),
                ...(doc?.current
                  ? [
                      {title: 'Startseite', href: previewPath('/')},
                      {title: 'Line-up', href: previewPath('/line-up')},
                    ]
                  : []),
              ],
            }),
          }),
          news: defineLocations({
            select: {title: 'titel', id: '_id'},
            resolve: doc => ({
              locations: doc?.id
                ? [
                    {title: doc?.title || 'News', href: previewPath(`/news/artikel/${doc.id}`)},
                    {title: 'Startseite', href: previewPath('/')},
                  ]
                : [],
            }),
          }),
          band: defineLocations({
            select: {title: 'name'},
            resolve: doc => ({
              locations: [{title: doc?.title || 'Line-up', href: previewPath('/line-up')}],
            }),
          }),
          historie: defineLocations({
            select: {title: 'titel', year: 'jahr', slug: 'slug.current'},
            resolve: doc => ({
              locations: [
                {title: 'Historie', href: previewPath('/historie')},
                ...(doc?.slug || doc?.year
                  ? [
                      {
                        title: doc?.title || `Festival ${doc?.year}`,
                        href: previewPath(`/historie/${doc?.slug || doc?.year}`),
                      },
                    ]
                  : []),
              ],
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
        ? previous.filter(
            template => !['siteSettings', 'festivalInfo'].includes(template.templateId),
          )
        : previous,
    actions: (previous, context) =>
      ['siteSettings', 'festivalInfo'].includes(context.schemaType)
        ? previous.filter(action =>
            ['publish', 'discardChanges', 'restore'].includes(action.action || ''),
          )
        : previous,
  },
})
