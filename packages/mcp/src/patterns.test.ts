import {describe, expect, it} from 'vitest'
import {formatCompactPatternDetails, getPatternUrl, parseCompactPatternDetails} from './patterns'
import {listPatterns} from './primer'

const searchPatternPage = `
  <main>
    <div>
      <div><nav>Product UI / Scenario patterns</nav><h1>Search</h1></div>
      <div>
        <p><img alt="" src="/assets/search-anatomy.png" /></p>
        <p>Search finds things that match specific criteria without including navigation chrome.</p>
        <h2>Implementation guidelines</h2>
        <p>Use <a href="/product/components/text-input/">TextInput</a> for a simple query.</p>
        <p>Use the <a href="/product/internal-components/filter/">Filter</a> component for tokenised qualifiers.</p>
        <h3>Loading results</h3>
        <p>Set aria-busy="true" while loading, and show an empty state when no results match.</p>
        <h2>Related scenario patterns</h2>
        <ul><li><a href="/product/scenario-patterns/filter/">Filter</a></li></ul>
      </div>
    </div>
  </main>
`

describe('compact pattern details', () => {
  const patterns = listPatterns()
  const search = patterns.find(pattern => pattern.name === 'Search')

  if (!search) throw new Error('Expected Search pattern')

  it('uses canonical Primer URLs for public and internal component references', () => {
    const details = parseCompactPatternDetails(searchPatternPage, search, getPatternUrl(search), patterns)

    expect(details).toEqual({
      detail: 'compact',
      pattern: {
        id: 'search',
        name: 'Search',
        category: 'scenario',
        sourceUrl: 'https://primer.style/product/scenario-patterns/search',
      },
      summary: 'Search finds things that match specific criteria without including navigation chrome.',
      components: [
        {
          id: 'text-input',
          name: 'TextInput',
          source: 'primer-public',
          sourceUrl: 'https://primer.style/product/components/text-input/',
        },
        {
          id: 'filter',
          name: 'Filter',
          source: 'primer-internal',
          sourceUrl: 'https://primer.style/product/internal-components/filter/',
        },
      ],
      relatedPatterns: [
        {
          id: 'filter',
          name: 'Filter',
          category: 'scenario',
          sourceUrl: 'https://primer.style/product/scenario-patterns/filter/',
        },
      ],
      guidance: {
        implementation: 'Use TextInput for a simple query. Use the Filter component for tokenised qualifiers.',
        accessibility: ['Set aria-busy="true" while loading, and show an empty state when no results match.'],
        states: ['Set aria-busy="true" while loading, and show an empty state when no results match.'],
      },
    })
  })

  it('keeps compact text below MCP truncation limits and excludes page chrome', () => {
    const details = parseCompactPatternDetails(searchPatternPage, search, getPatternUrl(search), patterns)
    const text = formatCompactPatternDetails(details)

    expect(text).not.toContain('Product UI / Scenario patterns')
    expect(text.length).toBeLessThan(4_000)
    expect(JSON.stringify(details).length).toBeLessThan(4_000)
  })

  it('rejects pages that do not have a discernible guidance body', () => {
    expect(() =>
      parseCompactPatternDetails('<main><h1>Search</h1></main>', search, getPatternUrl(search), patterns),
    ).toThrow('Unable to locate the pattern guidance content in the Primer Style page.')
  })
})
