import {describe, expect, it, vi} from 'vitest'
import {
  fetchInternalCatalog,
  findInternalCatalogEntries,
  getInternalCatalogUrl,
  parseInternalCatalog,
} from './internalCatalog'

const catalog = {
  schemaVersion: 1,
  revision: 'internal-catalog-v1',
  count: 2,
  items: [
    {
      id: 'filter',
      slug: 'filter',
      name: 'Filter',
      sourceKind: 'primer-internal',
      canonicalUrl: 'https://primer.style/product/internal-components/filter',
      visibility: 'github-only',
      availability: 'unavailable',
      installability: 'non-installable',
      implementationIncluded: false,
    },
    {
      id: 'action-list-items',
      slug: 'action-list-items',
      name: 'Action list items',
      sourceKind: 'primer-internal',
      canonicalUrl: 'https://primer.style/product/internal-components/action-list-items',
      visibility: 'github-only',
      availability: 'unavailable',
      installability: 'non-installable',
      implementationIncluded: false,
    },
  ],
} as const

describe('internal catalog', () => {
  it('parses safe documented entries with deterministic order and reference lookup', () => {
    const parsed = parseInternalCatalog(catalog)

    expect(parsed?.items.map(entry => entry.name)).toEqual(['Action list items', 'Filter'])
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
        items: [
          {
            ...catalog.items[0],
            canonicalUrl: 'https://github.com/github/github-ui',
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

  it('marks unsupported catalog schemas as stale instead of silently trusting them', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({...catalog, schemaVersion: 2})))

    await expect(fetchInternalCatalog(fetcher)).resolves.toMatchObject({
      status: 'stale',
      catalog: {revision: 'internal-catalog-v1'},
    })
  })
})
