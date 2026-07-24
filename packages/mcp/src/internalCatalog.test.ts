import {describe, expect, it, vi} from 'vitest'
import {
  fetchInternalCatalog,
  findInternalCatalogEntries,
  getInternalCatalogUrl,
  parseInternalCatalog,
} from './internalCatalog'

const catalog = {
  schemaVersion: 1,
  generatedAt: '2026-07-23T00:00:00.000Z',
  sourceRevision: 'sha256:internal-catalog-v1',
  entries: [
    {
      id: 'filter',
      name: 'Filter',
      sourceKind: 'primer-internal',
      sourceUrl: 'https://primer.style/product/internal-components/filter',
      visibility: 'github-only',
      availability: 'unavailable',
      implementationIncluded: false,
    },
    {
      id: 'action-list-items',
      name: 'Action list items',
      sourceKind: 'primer-internal',
      sourceUrl: 'https://primer.style/product/internal-components/action-list-items',
      visibility: 'github-only',
      availability: 'unavailable',
      implementationIncluded: false,
    },
  ],
} as const

describe('internal catalog', () => {
  it('parses safe documented entries with deterministic order and reference lookup', () => {
    const parsed = parseInternalCatalog(catalog)

    expect(parsed?.entries.map(entry => entry.name)).toEqual(['Action list items', 'Filter'])
    expect(
      findInternalCatalogEntries(
        parsed!,
        [
          {
            id: 'filter',
            name: 'Filter',
            source: 'primer-internal',
            sourceUrl: 'https://primer.style/product/internal-components/filter',
          },
        ],
        1,
      ),
    ).toEqual([expect.objectContaining({name: 'Filter', implementationIncluded: false})])
  })

  it('rejects private implementation metadata and non-Primer URLs', () => {
    expect(
      parseInternalCatalog({
        ...catalog,
        entries: [
          {
            ...catalog.entries[0],
            sourceUrl: 'https://github.com/github/github-ui',
            implementation: 'private source',
          },
        ],
      }),
    ).toBeUndefined()
  })

  it('reports unavailable endpoint responses without a fallback catalog', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, {status: 503}))

    await expect(fetchInternalCatalog(fetcher)).resolves.toMatchObject({
      status: 'unavailable',
      message: expect.stringContaining('503'),
    })
    expect(fetcher).toHaveBeenCalledWith(getInternalCatalogUrl())
  })

  it('marks old generated catalogs as stale instead of silently trusting them', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({...catalog, generatedAt: '2026-01-01T00:00:00.000Z'})))

    await expect(fetchInternalCatalog(fetcher, new Date('2026-07-23T00:00:00.000Z'))).resolves.toMatchObject({
      status: 'stale',
      catalog: {sourceRevision: 'sha256:internal-catalog-v1'},
    })
  })
})
