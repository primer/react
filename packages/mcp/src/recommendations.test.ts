import {describe, expect, it} from 'vitest'
import type {CompactPatternDetails} from './patterns'
import {
  createRecommendation,
  formatRecommendation,
  rankPatterns,
  type RecommendationComponent,
  type RecommendationIntentTerm,
} from './recommendations'

const sourceUrl = 'https://primer.style/product/components/text-input'
const availablePatterns = [
  {id: 'filter', name: 'Filter', category: 'scenario' as const},
  {id: 'search', name: 'Search', category: 'scenario' as const},
]
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
    generatedAt: '2026-07-23T00:00:00.000Z',
    sourceRevision: 'sha256:internal-catalog-v1',
    entries: [
      {
        id: 'filter',
        name: 'Filter',
        sourceKind: 'primer-internal' as const,
        sourceUrl: 'https://primer.style/product/internal-components/filter',
        visibility: 'github-only',
        availability: 'unavailable',
        implementationIncluded: false as const,
      },
    ],
  },
}
function component(
  id: string,
  name: string,
  intentTerms?: Array<RecommendationIntentTerm>,
  composition?: RecommendationComponent['composition'],
): RecommendationComponent {
  return {
    id,
    name,
    importPath: '@primer/react',
    sourceUrl: `https://primer.style/product/components/${id.replaceAll('_', '-')}`,
    searchTerms: [name],
    ...(intentTerms ? {intentTerms} : {}),
    ...(composition ? {composition} : {}),
  }
}

const emptyComposition = {
  apiParentChild: [],
  apiSubcomponents: [],
  observed: {parentChild: [], adjacentSibling: [], variants: [], relatedComponents: []},
}
const compositionComponents: Array<RecommendationComponent> = [
  component('counter_label', 'CounterLabel', ['count', 'metric', 'stat', 'statistic', 'total']),
  component(
    'page_layout',
    'PageLayout',
    [{all: ['sidebar', 'detail']}, {all: ['sidebar', 'pane']}, {all: ['master', 'detail']}, {all: ['split', 'pane']}],
    {
      ...emptyComposition,
      observed: {
        ...emptyComposition.observed,
        parentChild: [{parent: 'PageLayout.Pane', child: 'NavList', sourceCount: 3}],
      },
    },
  ),
  component('nav_list', 'NavList', [{all: ['sidebar', 'navigation']}, {all: ['sidebar', 'navigator']}]),
  component(
    'action_list',
    'ActionList',
    [{all: ['action', 'row']}, {all: ['action', 'list']}, {all: ['action', 'item']}, {all: ['action', 'choice']}],
    {
      ...emptyComposition,
      observed: {
        ...emptyComposition.observed,
        parentChild: [
          {parent: 'ActionList.LeadingVisual', child: 'Avatar', sourceCount: 3},
          {parent: 'ActionList.TrailingVisual', child: 'Label', sourceCount: 3},
        ],
      },
    },
  ),
  component('avatar', 'Avatar', ['avatar', 'member', 'people', 'person']),
  component('label', 'Label', ['badge', 'category', 'tag']),
  component('details', 'Details'),
  component('text', 'Text'),
  component('text_input', 'TextInput'),
  component('action_menu', 'ActionMenu'),
  component('pagination', 'Pagination'),
  component('select', 'Select'),
]

describe('component recommendations', () => {
  it('matches simple intent to authoritative pattern-linked public components', () => {
    const input = {intent: 'Add a search query'}
    const result = createRecommendation(input, rankPatterns(availablePatterns, input), [searchDetails], components)

    expect(result.status).toBe('matched')
    expect(result.patterns[0]?.pattern.name).toBe('Search')
    expect(result.components[0]?.component).toMatchObject({name: 'TextInput', sourceKind: 'primer-public'})
    expect(formatRecommendation(result)).toContain('Public components')
  })

  it('lets structured pattern hints outweigh freeform intent', () => {
    const input = {intent: 'search', patternHints: ['filter']}
    const result = createRecommendation(
      input,
      rankPatterns(availablePatterns, input),
      [searchDetails, filterDetails],
      components,
    )

    expect(result.patterns[0]?.pattern.name).toBe('Filter')
    expect(result.matchedSignals.patternHints).toEqual(['filter'])
  })

  it('expands source-derived composition relationships without inventing mappings', () => {
    const input = {intent: 'filter'}
    const result = createRecommendation(input, rankPatterns(availablePatterns, input), [filterDetails], components)

    expect(result.components.map(candidate => candidate.component.name)).toEqual(['ActionMenu', 'ActionList'])
    expect(result.components[1]?.evidence[0]).toMatchObject({sourceKind: 'composition'})
  })

  it('recommends capability and composition metadata for generic assemblies', () => {
    const metricIntent = {intent: 'Show a stat summary strip'}
    const detailIntent = {intent: 'Build a parent detail navigation layout with a sidebar'}
    const suggestionIntent = {intent: 'Show suggested people in action rows with avatars and status tags'}

    const metric = createRecommendation(
      metricIntent,
      rankPatterns(availablePatterns, metricIntent),
      [],
      compositionComponents,
    )
    const detail = createRecommendation(
      detailIntent,
      rankPatterns(availablePatterns, detailIntent),
      [],
      compositionComponents,
    )
    const suggestions = createRecommendation(
      suggestionIntent,
      rankPatterns(availablePatterns, suggestionIntent),
      [],
      compositionComponents,
    )

    expect(metric).toMatchObject({status: 'matched', patterns: []})
    expect(metric.components.map(candidate => candidate.component.name)).toContain('CounterLabel')
    expect(detail.components.map(candidate => candidate.component.name)).toEqual(
      expect.arrayContaining(['PageLayout', 'NavList']),
    )
    expect(suggestions.components.map(candidate => candidate.component.name)).toEqual(
      expect.arrayContaining(['ActionList', 'Avatar', 'Label']),
    )
    expect(suggestions.components.flatMap(candidate => candidate.evidence)).toContainEqual(
      expect.objectContaining({sourceKind: 'composition'}),
    )
  })

  it('requires full component names and grouped capability signals for direct metadata matches', () => {
    const noPatterns: Array<{id: string; name: string; category: 'scenario'}> = []
    const getComponents = (intent: string) =>
      createRecommendation({intent}, rankPatterns(noPatterns, {intent}), [], compositionComponents).components.map(
        candidate => candidate.component.name,
      )

    expect(getComponents('Use ActionList for these commands')).toContain('ActionList')
    expect(getComponents('Use an ActionMenu for these commands')).toContain('ActionMenu')
    expect(getComponents('Show plain status text')).toEqual(['Text'])
    expect(getComponents('Add tabs for navigation')).not.toContain('NavList')
    expect(getComponents('Add pagination to this list')).toEqual(expect.arrayContaining(['Pagination']))
    expect(getComponents('Add pagination to this list')).not.toEqual(expect.arrayContaining(['ActionList', 'NavList']))
    expect(getComponents('Select a repository')).toEqual(expect.arrayContaining(['Select']))
    expect(getComponents('Select a repository')).not.toContain('ActionList')
    expect(getComponents('Show a user account menu')).not.toContain('Avatar')
    expect(getComponents('Show a selected record detail')).not.toContain('Details')
    expect(getComponents('Show sidebar navigation beside selected record detail')).toEqual(
      expect.arrayContaining(['PageLayout', 'NavList']),
    )
    expect(getComponents('Show people in action rows with avatar images and status tags')).toEqual(
      expect.arrayContaining(['ActionList', 'Avatar', 'Label']),
    )
  })

  it('does not treat partial tokens or weak pattern-only matches as useful recommendations', () => {
    const emptyStates = [{id: 'empty-states', name: 'Empty States', category: 'ui' as const}]
    const input = {intent: 'stat'}
    const weakPatternInput = {intent: 'empty'}
    const emptyStateDetails: CompactPatternDetails = {
      ...searchDetails,
      pattern: {
        id: 'empty-states',
        name: 'Empty States',
        category: 'ui',
        sourceUrl: 'https://primer.style/product/ui-patterns/empty-states',
      },
      components: [
        {
          id: 'internal-empty-state',
          name: 'InternalEmptyState',
          source: 'primer-internal',
          sourceUrl: 'https://primer.style/product/internal-components/internal-empty-state',
        },
      ],
    }

    expect(rankPatterns(emptyStates, input)).toEqual([])
    expect(createRecommendation(input, rankPatterns(emptyStates, input), [], components)).toMatchObject({
      status: 'no-match',
      patterns: [],
      components: [],
    })
    expect(
      createRecommendation(
        weakPatternInput,
        rankPatterns(emptyStates, weakPatternInput),
        [emptyStateDetails],
        components,
      ),
    ).toMatchObject({status: 'no-match', patterns: [], components: []})
  })

  it('reports ambiguous and no-match intent with actionable states', () => {
    const ambiguous = {intent: 'search filter'}
    const noMatch = {intent: 'calendar'}

    expect(
      createRecommendation(
        ambiguous,
        rankPatterns(availablePatterns, ambiguous),
        [searchDetails, filterDetails],
        components,
      ).status,
    ).toBe('ambiguous')
    expect(createRecommendation(noMatch, rankPatterns(availablePatterns, noMatch), [], components)).toMatchObject({
      status: 'no-match',
      nextAction: expect.stringContaining('pattern hint'),
    })
  })

  it('excludes deprecated candidates and retains internal references as unresolved evidence', () => {
    const input = {intent: 'search'}
    const result = createRecommendation(input, rankPatterns(availablePatterns, input), [searchDetails], components)

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
      rankPatterns(availablePatterns, input),
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

  it('keeps low-scoring internal-only patterns visible only for the all source scope', () => {
    const internalOnlyPatterns = [{id: 'filter', name: 'Filter', category: 'scenario' as const}]
    const internalOnlyDetails: CompactPatternDetails = {
      ...filterDetails,
      components: [
        {
          id: 'filter',
          name: 'Filter',
          source: 'primer-internal',
          sourceUrl: 'https://primer.style/product/internal-components/filter',
        },
      ],
    }
    const input = {intent: 'filter'}

    const allScope = createRecommendation(
      {...input, sourceScope: 'all'},
      rankPatterns(internalOnlyPatterns, input),
      [internalOnlyDetails],
      components,
      internalCatalog,
    )
    const publicScope = createRecommendation(
      input,
      rankPatterns(internalOnlyPatterns, input),
      [internalOnlyDetails],
      components,
      internalCatalog,
    )

    expect(allScope).toMatchObject({
      status: 'partial-match',
      patterns: [expect.objectContaining({pattern: expect.objectContaining({name: 'Filter'})})],
      components: [],
      internalComponents: [expect.objectContaining({component: expect.objectContaining({name: 'Filter'})})],
    })
    expect(formatRecommendation(allScope)).toContain('Documented internal candidates')
    expect(publicScope).toMatchObject({status: 'no-match', patterns: [], internalComponents: []})
    expect(formatRecommendation(publicScope)).toMatch(/^No Primer pattern matched/)
  })

  it('uses stable lexical ordering and bounded payloads', () => {
    const input = {intent: 'search filter', limit: 1}
    const first = createRecommendation(
      input,
      rankPatterns(availablePatterns, input),
      [searchDetails, filterDetails],
      components,
    )
    const second = createRecommendation(
      input,
      rankPatterns(availablePatterns, input),
      [searchDetails, filterDetails],
      components,
    )

    expect(first).toEqual(second)
    expect(first.patterns).toHaveLength(1)
    expect(first.components).toHaveLength(1)
    expect(JSON.stringify(first).length).toBeLessThan(5_000)
  })
})
