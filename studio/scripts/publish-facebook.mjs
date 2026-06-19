import {createHash} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const sourcePath = path.resolve(scriptDir, '../../imports/facebook/news.json')
const client = getCliClient({apiVersion: '2026-06-19'}).withConfig({
  perspective: 'raw',
  useCdn: false,
})

function facebookId(url) {
  try {
    const lastPart = new URL(url).pathname.split('/').filter(Boolean).at(-1)
    if (lastPart) return lastPart.replace(/[^a-zA-Z0-9_-]/g, '')
  } catch {}

  return createHash('sha1').update(url).digest('hex')
}

const source = JSON.parse(await readFile(sourcePath, 'utf8'))
if (!Array.isArray(source)) throw new Error('Die Quelldatei muss ein JSON-Array enthalten.')

const publishedIds = [
  ...new Set(source.map((post) => `facebook-${facebookId(post.url)}`.slice(0, 120))),
]
const draftIds = publishedIds.map((id) => `drafts.${id}`)
const drafts = (await client.getDocuments(draftIds)).filter(Boolean)

console.log(`Facebook-News: ${publishedIds.length}, vorhandene Entwuerfe: ${drafts.length}`)

let published = 0
let failed = 0

for (const [index, draft] of drafts.entries()) {
  const publishedId = draft._id.replace(/^drafts\./, '')

  try {
    await client.action({
      actionType: 'sanity.action.document.publish',
      draftId: draft._id,
      publishedId,
      ifDraftRevisionId: draft._rev,
    })
    published += 1
    console.log(`[${index + 1}/${drafts.length}] published: ${publishedId}`)
  } catch (error) {
    failed += 1
    console.error(`[${index + 1}/${drafts.length}] Fehler: ${publishedId}: ${error.message}`)
  }
}

const [remainingDrafts, publishedDocuments] = await Promise.all([
  client.getDocuments(draftIds),
  client.getDocuments(publishedIds),
])
const remainingDraftCount = remainingDrafts.filter(Boolean).length
const publishedCount = publishedDocuments.filter(Boolean).length

console.log(
  `Fertig. Neu veroeffentlicht: ${published}, insgesamt veroeffentlicht: ${publishedCount}, verbleibende Entwuerfe: ${remainingDraftCount}, Fehler: ${failed}`,
)

if (failed > 0 || publishedCount !== publishedIds.length || remainingDraftCount > 0) {
  process.exitCode = 1
}
