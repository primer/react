import type {ComponentSource, PatternComponentReference} from './patterns'

const catalogUrl = new URL('/product/internal-components/catalog.json', 'https://primer.style')
const maximumCatalogEntries = 100

export interface InternalCatalogEntry {
  id: string
  slug: string
  name: string
  sourceKind: Extract<ComponentSource, 'primer-internal'>
  canonicalUrl: string
  visibility: string
  availability: string
  installability: 'non-installable'
  implementationIncluded: false
}

export interface InternalCatalog {
  schemaVersion: number
  revision: string
  count: number
  items: Array<InternalCatalogEntry>
}

export interface InternalCatalogResult {
  status: 'available' | 'unavailable' | 'stale' | 'not-requested'
  catalog?: InternalCatalog
  message?: string
}

export async function fetchInternalCatalog(fetcher: typeof fetch = fetch): Promise<InternalCatalogResult> {
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

  if (isStale(catalog)) {
    return {
      status: 'stale',
      catalog,
      message:
        'The Primer internal catalog uses an unsupported schema version; review its revision before relying on it.',
    }
  }

  return {status: 'available', catalog}
}

export function parseInternalCatalog(value: unknown): InternalCatalog | undefined {
  if (!isRecord(value)) return undefined
  if (
    typeof value.schemaVersion !== 'number' ||
    !Number.isInteger(value.schemaVersion) ||
    typeof value.revision !== 'string' ||
    typeof value.count !== 'number' ||
    !Number.isInteger(value.count) ||
    !Array.isArray(value.items)
  ) {
    return undefined
  }

  const items = value.items.map(parseInternalCatalogEntry)
  if (items.some((entry): entry is undefined => entry === undefined)) return undefined
  if (value.count !== items.length) return undefined

  return {
    schemaVersion: value.schemaVersion,
    revision: value.revision,
    count: value.count,
    items: items
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
  const entryById = new Map(catalog.items.map(entry => [normalize(entry.id), entry]))
  const entryByName = new Map(catalog.items.map(entry => [normalize(entry.name), entry]))

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
    typeof value.slug !== 'string' ||
    typeof value.name !== 'string' ||
    value.sourceKind !== 'primer-internal' ||
    typeof value.canonicalUrl !== 'string' ||
    typeof value.visibility !== 'string' ||
    typeof value.availability !== 'string' ||
    value.installability !== 'non-installable' ||
    value.implementationIncluded !== false ||
    !isPrimerInternalUrl(value.canonicalUrl)
  ) {
    return undefined
  }

  return {
    id: value.id,
    slug: value.slug,
    name: value.name,
    sourceKind: value.sourceKind,
    canonicalUrl: value.canonicalUrl,
    visibility: value.visibility,
    availability: value.availability,
    installability: value.installability,
    implementationIncluded: false,
  }
}

function isStale(catalog: InternalCatalog): boolean {
  return catalog.schemaVersion !== 1
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
