import {createHash} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const sourcePath = path.resolve(scriptDir, '../../imports/facebook/news.json')
const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const limitArg = process.argv.find(arg => arg.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined
const client = dryRun ? null : getCliClient({apiVersion: '2026-06-19'})

function decodeHtml(value = '') {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
}

function extractMeta(html, property) {
  const propertyFirst = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    'i',
  )
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["'][^>]*>`,
    'i',
  )
  return decodeHtml(html.match(propertyFirst)?.[1] || html.match(contentFirst)?.[1] || '')
}

function facebookId(url) {
  try {
    const lastPart = new URL(url).pathname.split('/').filter(Boolean).at(-1)
    if (lastPart) return lastPart.replace(/[^a-zA-Z0-9_-]/g, '')
  } catch {}

  return createHash('sha1').update(url).digest('hex')
}

function makeTitle(text, index) {
  const compact = text.replace(/\s+/g, ' ').trim()
  if (!compact) return `Facebook-Beitrag ${index + 1}`

  const firstSentence = compact.match(/^.{1,90}?(?:[.!?](?:\s|$)|$)/)?.[0] || compact.slice(0, 90)
  return firstSentence.trim().replace(/[.!?]+$/, '') || `Facebook-Beitrag ${index + 1}`
}

function portableText(text, key) {
  if (!text.trim()) return []

  return text
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: 'block',
      _key: `block-${key.slice(-8)}-${index}`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `span-${key.slice(-8)}-${index}`,
          text: paragraph,
          marks: [],
        },
      ],
    }))
}

async function inspectPost(post, index) {
  const response = await fetch(post.url, {
    headers: {'user-agent': 'Mozilla/5.0 (compatible; MetalImDorfImporter/1.0)'},
  })
  if (!response.ok) throw new Error(`Facebook antwortet mit HTTP ${response.status}`)

  const html = await response.text()
  const id = facebookId(post.url)
  return {
    index,
    id,
    documentId: `facebook-${id}`.slice(0, 120),
    title: makeTitle(post.text || '', index),
    text: post.text || '',
    imageUrl: extractMeta(html, 'og:image'),
    date: post.date || post.created_time || post.timestamp || null,
    source: post,
  }
}

async function uploadImage(item) {
  if (!item.imageUrl || !client) return undefined

  const response = await fetch(item.imageUrl, {
    headers: {'user-agent': 'Mozilla/5.0 (compatible; MetalImDorfImporter/1.0)'},
  })
  if (!response.ok) throw new Error(`Bild antwortet mit HTTP ${response.status}`)

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), {
    filename: `facebook-${item.id}.${extension}`,
    contentType,
  })

  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    alt: item.title,
  }
}

async function importItem(item) {
  const draftId = `drafts.${item.documentId}`
  const existing =
    (await client.getDocument(draftId)) || (await client.getDocument(item.documentId))
  if (existing) return {status: 'skipped', reason: 'bereits vorhanden'}

  let image
  try {
    image = await uploadImage(item)
  } catch (error) {
    console.warn(`  Bild uebersprungen: ${error.message}`)
  }
  const document = {
    _id: draftId,
    _type: 'news',
    titel: item.title,
    ...(item.date ? {datum: new Date(item.date).toISOString().slice(0, 10)} : {}),
    inhalt: portableText(item.text, item.id),
    ...(image ? {bild: image} : {}),
    facebookQuelle: {
      id: item.id,
      url: item.source.url,
      likes: item.source.likes,
      comments: item.source.comments,
      shares: item.source.shares,
      reihenfolge: item.index,
      importiertAm: new Date().toISOString(),
    },
  }

  await client.create(document)
  return {status: 'created', image: Boolean(image)}
}

const source = JSON.parse(await readFile(sourcePath, 'utf8'))
if (!Array.isArray(source)) throw new Error('Die Quelldatei muss ein JSON-Array enthalten.')

const selected = Number.isFinite(limit) ? source.slice(0, limit) : source
console.log(`${dryRun ? 'Testlauf' : 'Import'}: ${selected.length} von ${source.length} Beiträgen`)

let created = 0
let skipped = 0
let failed = 0
let missingDates = 0
let missingImages = 0

for (const [index, post] of selected.entries()) {
  try {
    if (!dryRun) {
      const id = facebookId(post.url)
      const documentId = `facebook-${id}`.slice(0, 120)
      const existing =
        (await client.getDocument(`drafts.${documentId}`)) ||
        (await client.getDocument(documentId))

      if (existing) {
        skipped += 1
        console.log(`[${index + 1}/${selected.length}] skipped: bereits vorhanden`)
        continue
      }
    }

    const item = await inspectPost(post, index)
    if (!item.date) missingDates += 1
    if (!item.imageUrl) missingImages += 1

    if (dryRun) {
      console.log(
        `[${index + 1}/${selected.length}] ${item.title} | Bild: ${item.imageUrl ? 'ja' : 'nein'} | Datum: ${item.date || 'fehlt'}`,
      )
      continue
    }

    const result = await importItem(item)
    if (result.status === 'created') created += 1
    else skipped += 1
    console.log(`[${index + 1}/${selected.length}] ${result.status}: ${item.title}`)
  } catch (error) {
    failed += 1
    console.error(`[${index + 1}/${selected.length}] Fehler: ${error.message}`)
  }
}

console.log(
  dryRun
    ? `Testlauf beendet. Fehlende Bilder: ${missingImages}, fehlende Daten: ${missingDates}, Fehler: ${failed}`
    : `Import beendet. Erstellt: ${created}, übersprungen: ${skipped}, Fehler: ${failed}`,
)

if (failed > 0) process.exitCode = 1
