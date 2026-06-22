import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {useMemo, useState} from 'react'
import {
  PatchEvent,
  set,
  setIfMissing,
  unset,
  type FormPatch,
  type ObjectInputProps,
  type SanityDocument,
} from 'sanity'

interface QuickImage {
  _key?: string
  _type: 'image'
  asset?: {_ref: string; _type: 'reference'}
  alt?: string
  caption?: string
}

interface QuickEntry {
  text?: string
  datum?: string
  url?: string
  bilder?: QuickImage[]
}

interface NewsDocument extends SanityDocument {
  facebookSchnelleingabe?: QuickEntry
}

function createTextBlocks(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _key: `quick-${Date.now()}-${index}`,
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{_key: `quick-span-${index}`, _type: 'span', marks: [], text: paragraph}],
    }))
}

function today() {
  return new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Berlin'}).format(new Date())
}

export default function NewsDocumentInput(props: ObjectInputProps) {
  const [message, setMessage] = useState('')
  const document = props.value as NewsDocument | undefined
  const quickEntry = document?.facebookSchnelleingabe
  const parsed = useMemo(() => {
    const lines = quickEntry?.text?.split('\n') ?? []
    const titleIndex = lines.findIndex((line) => line.trim())
    const title = titleIndex >= 0 ? lines[titleIndex].trim() : ''
    const body = titleIndex >= 0 ? lines.slice(titleIndex + 1).join('\n').trim() : ''
    return {title, body}
  }, [quickEntry?.text])

  const applyQuickEntry = () => {
    if (!parsed.title) return

    const patches: FormPatch[] = [
      set(parsed.title, ['titel']),
      set(quickEntry?.datum || today(), ['datum']),
    ]

    if (parsed.body) patches.push(set(createTextBlocks(parsed.body), ['inhalt']))

    const images = quickEntry?.bilder?.filter((image) => image.asset?._ref) ?? []
    if (images[0]) patches.push(set(images[0], ['bild']))
    patches.push(set(images.slice(1), ['bilder']))

    if (quickEntry?.url) {
      patches.push(setIfMissing({_type: 'facebookQuelle'}, ['facebookQuelle']))
      patches.push(set(quickEntry.url, ['facebookQuelle', 'url']))
    }

    patches.push(unset(['facebookSchnelleingabe']))

    props.onChange(PatchEvent.from(patches))
    setMessage('Die Angaben wurden in die News-Felder übernommen.')
  }

  return (
    <Stack space={4}>
      <Card border padding={4} radius={2} tone="primary">
        <Flex align="center" gap={4} justify="space-between" wrap="wrap">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Facebook-Schnelleingabe
            </Text>
            <Text muted size={1}>
              Text und Bilder im Tab „Schnelleingabe“ einfügen und anschließend übernehmen.
            </Text>
            {message && <Text size={1}>{message}</Text>}
          </Stack>
          <Button
            disabled={!parsed.title}
            mode="default"
            onClick={applyQuickEntry}
            text="Als News übernehmen"
            tone="primary"
          />
        </Flex>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
