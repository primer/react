import type {ComponentSource, PatternComponentReference} from './patterns'

const catalogUrl = new URL('/product/internal-components/catalog.json', 'https://primer.style')
const maximumCatalogEntries = 100
const maximumCatalogAgeMilliseconds = 30 * 24 * 60 * 60 * 1000

export interface InternalCatalogEntry {
  id: string
  name: string
  sourceKind: Extract<ComponentSource, 'primer-internal'>
  sourceUrl: string
  visibility: string
  availability: string
  implementationIncluded: false
}

export interface InternalCatalog {
  schemaVersion: number
  generatedAt: string
  sourceRevision: string
  entries: Array<InternalCatalogEntry>
}

export interface InternalCatalogResult {
  status: 'available' | 'unavailable' | 'stale' | 'not-requested'
  catalog?: InternalCatalog
  message?: string
}

export async function fetchInternalCatalog(
  fetcher: typeof fetch = fetch,
  now: Date = new Date(),
): Promise<InternalCatalogResult> {
  let response: Response
  try {
    response = await fetcher(catalogUrl)
  } catch {
    return {status: 'unavailable', message: 'The Primer internal catalog endpoint could not be reached.'}
  }

  if (!response.ok) {
    return {
      status: 'unavailable',
      message: `The Primer internal catalog endpoint returned ${response.status}.`,
    }
  }

  let value: unknown
  try {
    value = await response.json()
  } catch {
    return {status: 'unavailable', message: 'The Primer internal catalog endpoint returned invalid JSON.'}
  }

  const catalog = parseInternalCatalog(value)
  if (!catalog) {
    return {status: 'unavailable', message: 'The Primer internal catalog endpoint returned an invalid catalog.'}
  }

  if (isStale(catalog, now)) {
    return {
      status: 'stale',
      catalog,
      message: 'The Primer internal catalog is older than 30 days; review its source revision before relying on it.',
    }
  }

  return {status: 'available', catalog}
}

export function parseInternalCatalog(value: unknown): InternalCatalog | undefined {
  if (!isRecord(value)) return undefined
  if (
    typeof value.schemaVersion !== 'number' ||
    !Number.isInteger(value.schemaVersion) ||
    typeof value.generatedAt !== 'string' ||
    typeof value.sourceRevision !== 'string' ||
    !Array.isArray(value.entries)
  ) {
    return undefined
  }

  const entries = value.entries.map(parseInternalCatalogEntry)
  if (entries.some((entry): entry is undefined => entry === undefined)) return undefined

  return {
    schemaVersion: value.schemaVersion,
    generatedAt: value.generatedAt,
    sourceRevision: value.sourceRevision,
    entries: entries
      .filter((entry): entry is InternalCatalogEntry => entry !== undefined)
      .sort((first, second) => first.name.localeCompare(second.name))
      .slice(0, maximumCatalogEntries),
  }
}

export function findInternalCatalogEntries(
  catalog: InternalCatalog,
  references: Array<PatternComponentReference>,
  limit: number,
): Array<InternalCatalogEntry> {
  const entryById = new Map(catalog.entries.map(entry => [normalize(entry.id), entry]))
  const entryByName = new Map(catalog.entries.map(entry => [normalize(entry.name), entry]))

  return references
    .filter(reference => reference.source === 'primer-internal')
    .flatMap(reference => {
      const entry = entryById.get(normalize(reference.id)) ?? entryByName.get(normalize(reference.name))
      return entry ? [entry] : []
    })
    .filter((entry, index, entries) => entries.findIndex(candidate => candidate.id === entry.id) === index)
    .sort((first, second) => first.name.localeCompare(second.name))
    .slice(0, limit)
}

export function getInternalCatalogUrl(): URL {
  return new URL(catalogUrl)
}

function parseInternalCatalogEntry(value: unknown): InternalCatalogEntry | undefined {
  if (!isRecord(value)) return undefined
  if (
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    value.sourceKind !== 'primer-internal' ||
    typeof value.sourceUrl !== 'string' ||
    typeof value.visibility !== 'string' ||
    typeof value.availability !== 'string' ||
    value.implementationIncluded !== false ||
    !isPrimerInternalUrl(value.sourceUrl)
  ) {
    return undefined
  }

  return {
    id: value.id,
    name: value.name,
    sourceKind: value.sourceKind,
    sourceUrl: value.sourceUrl,
    visibility: value.visibility,
    availability: value.availability,
    implementationIncluded: false,
  }
}

function isStale(catalog: InternalCatalog, now: Date): boolean {
  const generatedAt = Date.parse(catalog.generatedAt)
  return (
    catalog.schemaVersion !== 1 ||
    Number.isNaN(generatedAt) ||
    generatedAt > now.getTime() ||
    now.getTime() - generatedAt > maximumCatalogAgeMilliseconds
  )
}

function isPrimerInternalUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.origin === 'https://primer.style' && url.pathname.startsWith('/product/internal-components/')
  } catch {
    return false
  }
}

function normalize(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
