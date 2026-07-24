import {describe, expect, it} from 'vitest'
import type {CompactPatternDetails} from './patterns'
import {createRecommendation, formatRecommendation, rankPatterns, type RecommendationComponent} from './recommendations'
import {listPatterns} from './primer'

const sourceUrl = 'https://primer.style/product/components/text-input'
const searchDetails: CompactPatternDetails = {
  detail: 'compact',
  pattern: {
    id: 'search',
    name: 'Search',
    category: 'scenario',
    sourceUrl: 'https://primer.style/product/scenario-patterns/search',
  },
  summary: 'Search guidance.',
  components: [
    {id: 'text-input', name: 'TextInput', source: 'primer-public', sourceUrl},
    {
      id: 'filter',
      name: 'Filter',
      source: 'primer-internal',
      sourceUrl: 'https://primer.style/product/internal-components/filter',
    },
    {
      id: 'octicon',
      name: 'Octicon',
      source: 'primer-public',
      sourceUrl: 'https://primer.style/product/components/octicon',
    },
  ],
  relatedPatterns: [],
  guidance: {implementation: '', accessibility: [], states: []},
}
const filterDetails: CompactPatternDetails = {
  ...searchDetails,
  pattern: {
    id: 'filter',
    name: 'Filter',
    category: 'scenario',
    sourceUrl: 'https://primer.style/product/scenario-patterns/filter',
  },
  components: [
    {
      id: 'action-menu',
      name: 'ActionMenu',
      source: 'primer-public',
      sourceUrl: 'https://primer.style/product/components/action-menu',
    },
  ],
}
const components: Array<RecommendationComponent> = [
  {
    id: 'text_input',
    name: 'TextInput',
    importPath: '@primer/react',
    sourceUrl,
    searchTerms: ['TextInput', 'query', 'search'],
  },
  {
    id: 'action_menu',
    name: 'ActionMenu',
    importPath: '@primer/react',
    sourceUrl: 'https://primer.style/product/components/action-menu',
    searchTerms: ['ActionMenu', 'filter'],
    composition: {
      apiParentChild: [],
      apiSubcomponents: [],
      observed: {
        parentChild: [{parent: 'ActionMenu.Overlay', child: 'ActionList', sourceCount: 2}],
        adjacentSibling: [],
        variants: [],
        relatedComponents: [],
      },
    },
  },
  {
    id: 'action_list',
    name: 'ActionList',
    importPath: '@primer/react',
    sourceUrl: 'https://primer.style/product/components/action-list',
    searchTerms: ['ActionList'],
  },
  {
    id: 'octicon',
    name: 'Octicon',
    importPath: '@primer/react/deprecated',
    status: 'deprecated',
    sourceUrl: 'https://primer.style/product/components/octicon',
    searchTerms: ['Octicon'],
  },
]
const internalCatalog = {
  status: 'available' as const,
  catalog: {
    schemaVersion: 1,
    revision: 'internal-catalog-v1',
    count: 1,
    items: [
      {
        id: 'filter',
        slug: 'filter',
        name: 'Filter',
        sourceKind: 'primer-internal' as const,
        canonicalUrl: 'https://primer.style/product/internal-components/filter',
        visibility: 'github-only',
        availability: 'unavailable',
        installability: 'non-installable' as const,
        implementationIncluded: false as const,
      },
    ],
  },
}

describe('component recommendations', () => {
  it('matches simple intent to authoritative pattern-linked public components', () => {
    const input = {intent: 'Add a search query'}
    const result = createRecommendation(input, rankPatterns(listPatterns(), input), [searchDetails], components)

    expect(result.status).toBe('matched')
    expect(result.patterns[0]?.pattern.name).toBe('Search')
    expect(result.components[0]?.component).toMatchObject({name: 'TextInput', sourceKind: 'primer-public'})
    expect(formatRecommendation(result)).toContain('Public components')
  })

  it('lets structured pattern hints outweigh freeform intent', () => {
    const input = {intent: 'search', patternHints: ['filter']}
    const result = createRecommendation(
      input,
      rankPatterns(listPatterns(), input),
      [searchDetails, filterDetails],
      components,
    )

    expect(result.patterns[0]?.pattern.name).toBe('Filter')
    expect(result.matchedSignals.patternHints).toEqual(['filter'])
  })

  it('expands source-derived composition relationships without inventing mappings', () => {
    const input = {intent: 'filter'}
    const result = createRecommendation(input, rankPatterns(listPatterns(), input), [filterDetails], components)

    expect(result.components.map(candidate => candidate.component.name)).toEqual(['ActionMenu', 'ActionList'])
    expect(result.components[1]?.evidence[0]).toMatchObject({sourceKind: 'composition'})
  })

  it('reports ambiguous and no-match intent with actionable states', () => {
    const ambiguous = {intent: 'search filter'}
    const noMatch = {intent: 'calendar'}

    expect(
      createRecommendation(
        ambiguous,
        rankPatterns(listPatterns(), ambiguous),
        [searchDetails, filterDetails],
        components,
      ).status,
    ).toBe('ambiguous')
    expect(createRecommendation(noMatch, rankPatterns(listPatterns(), noMatch), [], components)).toMatchObject({
      status: 'no-match',
      nextAction: expect.stringContaining('pattern hint'),
    })
  })

  it('excludes deprecated candidates and retains internal references as unresolved evidence', () => {
    const input = {intent: 'search'}
    const result = createRecommendation(input, rankPatterns(listPatterns(), input), [searchDetails], components)

    expect(result.components.map(candidate => candidate.component.name)).not.toContain('Octicon')
    expect(result.exclusions).toContainEqual({name: 'Octicon', source: 'primer-public', reason: 'deprecated'})
    expect(result.unresolvedReferences).toContainEqual(
      expect.objectContaining({name: 'Filter', source: 'primer-internal', reason: 'internal-reference'}),
    )
  })

  it('resolves documented internal references separately for the all source scope', () => {
    const input = {intent: 'search', sourceScope: 'all' as const}
    const result = createRecommendation(
      input,
      rankPatterns(listPatterns(), input),
      [searchDetails],
      components,
      internalCatalog,
    )

    expect(result.components.map(candidate => candidate.component.name)).toEqual(['TextInput'])
    expect(result.internalComponents).toEqual([
      expect.objectContaining({
        component: expect.objectContaining({
          name: 'Filter',
          sourceKind: 'primer-internal',
          installable: false,
          implementationIncluded: false,
        }),
      }),
    ])
    expect(result.unresolvedReferences).not.toContainEqual(expect.objectContaining({name: 'Filter'}))
    expect(formatRecommendation(result)).toContain('GitHub-only; no public import')
  })

  it('uses stable lexical ordering and bounded payloads', () => {
    const input = {intent: 'search filter', limit: 1}
    const first = createRecommendation(
      input,
      rankPatterns(listPatterns(), input),
      [searchDetails, filterDetails],
      components,
    )
    const second = createRecommendation(
      input,
      rankPatterns(listPatterns(), input),
      [searchDetails, filterDetails],
      components,
    )

    expect(first).toEqual(second)
    expect(first.patterns).toHaveLength(1)
    expect(first.components).toHaveLength(1)
    expect(JSON.stringify(first).length).toBeLessThan(5_000)
  })
})
