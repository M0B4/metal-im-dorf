import {defineField} from 'sanity'

/** Bildbeschreibung für Screenreader und Suchmaschinen. Leer = die Website nimmt einen passenden Standardtext. */
export const altField = (example: string) =>
  defineField({
    name: 'alt',
    title: 'Bildbeschreibung',
    description: `Optional. Kurz, was zu sehen ist, z. B. „${example}“. Hilft Blinden und Suchmaschinen.`,
    type: 'string',
  })
