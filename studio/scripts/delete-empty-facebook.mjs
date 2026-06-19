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

function hasText(document) {
  return Boolean(
    document?.inhalt?.some(
      (block) =>
        block?._type === 'block' &&
        block.children?.some((child) => child?._type === 'span' && child.text?.trim()),
    ),
  )
}

const source = JSON.parse(await readFile(sourcePath, 'utf8'))
if (!Array.isArray(source)) throw new Error('Die Quelldatei muss ein JSON-Array enthalten.')

const publishedIds = [
  ...new Set(
    source
      .filter((post) => !post.text?.trim())
      .map((post) => `facebook-${facebookId(post.url)}`.slice(0, 120)),
  ),
]
const ids = publishedIds.flatMap((id) => [id, `drafts.${id}`])
const documents = (await client.getDocuments(ids)).filter(Boolean)
const candidates = documents.filter((document) => !hasText(document))
const protectedDocuments = documents.filter(hasText)

console.log(
  `Ohne Quelltext: ${publishedIds.length}, wirklich leer: ${candidates.length}, wegen vorhandenem Sanity-Text geschuetzt: ${protectedDocuments.length}`,
)

if (candidates.length > 0) {
  let transaction = client.transaction()
  for (const document of candidates) transaction = transaction.delete(document._id)
  await transaction.commit()
}

const remaining = (await client.getDocuments(candidates.map((document) => document._id))).filter(
  Boolean,
)
console.log(`Geloescht: ${candidates.length - remaining.length}, noch vorhanden: ${remaining.length}`)

if (remaining.length > 0) process.exitCode = 1
