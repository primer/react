// eslint-disable-next-line import/no-namespace
import * as cheerio from 'cheerio'
import type {Pattern} from './primer'

type CheerioContent = ReturnType<cheerio.CheerioAPI>

const maximumComponentReferences = 12
const maximumRelatedPatterns = 6
const maximumGuidanceItems = 2
const maximumSummaryLength = 480
const maximumGuidanceItemLength = 280
const maximumImplementationLength = 900

export type ComponentSource = 'primer-public' | 'primer-internal'

export interface PatternReference {
  id: string
  name: string
  category: Pattern['category']
  sourceUrl: string
}

export interface PatternComponentReference {
  id: string
  name: string
  source: ComponentSource
  sourceUrl: string
}

export interface PatternGuidance {
  implementation: string
  accessibility: Array<string>
  states: Array<string>
}

export interface CompactPatternDetails extends Record<string, unknown> {
  detail: 'compact'
  pattern: PatternReference
  summary: string
  components: Array<PatternComponentReference>
  relatedPatterns: Array<PatternReference>
  guidance: PatternGuidance
}

export interface FullPatternDetails extends Record<string, unknown> {
  detail: 'full'
  pattern: PatternReference
}

export type PatternDetails = CompactPatternDetails | FullPatternDetails

export function getPatternUrl(pattern: Pattern): URL {
  const basePath = pattern.category === 'scenario' ? 'scenario-patterns' : 'ui-patterns'
  return new URL(`/product/${basePath}/${pattern.id}`, 'https://primer.style')
}

export function parseCompactPatternDetails(
  html: string,
  pattern: Pattern,
  sourceUrl: URL,
  patterns: Array<Pattern>,
): CompactPatternDetails {
  const $ = cheerio.load(html)
  const content = getPatternContent($)

  return {
    detail: 'compact',
    pattern: toPatternReference(pattern, sourceUrl),
    summary: truncate(
      getText(
        content
          .find('p')
          .filter((_, element) => getText($(element)).length > 0)
          .first(),
      ),
      maximumSummaryLength,
    ),
    components: getComponentReferences($, content, sourceUrl),
    relatedPatterns: getRelatedPatterns($, content, sourceUrl, patterns),
    guidance: {
      implementation: getImplementationGuidance($, content),
      accessibility: getGuidanceByKeyword($, content, /aria-|screen reader|assistive|keyboard|focus/i),
      states: getGuidanceByKeyword($, content, /loading|empty|error|state|recover/i),
    },
  }
}

export function toFullPatternDetails(pattern: Pattern, sourceUrl: URL): FullPatternDetails {
  return {
    detail: 'full',
    pattern: toPatternReference(pattern, sourceUrl),
  }
}

export function formatCompactPatternDetails(details: CompactPatternDetails): string {
  const componentLines = details.components.map(component => {
    return `- ${component.name} (${component.source}): ${component.sourceUrl}`
  })
  const relatedPatternLines = details.relatedPatterns.map(pattern => {
    return `- ${pattern.name} (${pattern.category}): ${pattern.sourceUrl}`
  })
  const guidanceLines = [
    details.guidance.implementation && `Implementation: ${details.guidance.implementation}`,
    ...details.guidance.accessibility.map(guidance => `Accessibility: ${guidance}`),
    ...details.guidance.states.map(guidance => `States: ${guidance}`),
  ].filter((line): line is string => Boolean(line))

  return [
    `## ${details.pattern.name} (${details.pattern.category} pattern)`,
    details.summary,
    `Source: ${details.pattern.sourceUrl}`,
    componentLines.length > 0 ? `Components:\n${componentLines.join('\n')}` : undefined,
    relatedPatternLines.length > 0 ? `Related patterns:\n${relatedPatternLines.join('\n')}` : undefined,
    guidanceLines.length > 0 ? `Guidance:\n${guidanceLines.map(line => `- ${line}`).join('\n')}` : undefined,
    'Pass `detail: "full"` for the complete Primer Style guidance.',
  ]
    .filter((section): section is string => Boolean(section))
    .join('\n\n')
}

function getPatternContent($: cheerio.CheerioAPI) {
  const main = $('main').first()
  const heading = main.find('h1').first()
  const pageContent = heading.parent().parent()
  const content = pageContent
    .children()
    .filter((_, element) => $(element).find('h2').length > 0)
    .first()

  if (!main.length || !heading.length || !content.length) {
    throw new Error('Unable to locate the pattern guidance content in the Primer Style page.')
  }

  return content
}

function getComponentReferences(
  $: cheerio.CheerioAPI,
  content: CheerioContent,
  sourceUrl: URL,
): Array<PatternComponentReference> {
  const references = new Map<string, PatternComponentReference>()

  content.find('a[href]').each((_, element) => {
    const href = $(element).attr('href')
    const reference = href ? toComponentReference(href, getText($(element)), sourceUrl) : undefined
    if (!reference) return

    const current = references.get(reference.sourceUrl)
    if (!current || (href && !href.includes('#') && current.name !== reference.name)) {
      references.set(reference.sourceUrl, reference)
    }
  })

  return [...references.values()].slice(0, maximumComponentReferences)
}

function getRelatedPatterns(
  $: cheerio.CheerioAPI,
  content: CheerioContent,
  sourceUrl: URL,
  patterns: Array<Pattern>,
): Array<PatternReference> {
  const heading = content
    .find('h2')
    .filter((_, element) => /related .*patterns/i.test(getText($(element))))
    .first()
  if (!heading.length) return []

  const references = new Map<string, PatternReference>()
  heading
    .nextUntil('h2')
    .find('a[href]')
    .each((_, element) => {
      const href = $(element).attr('href')
      if (!href) return

      const reference = toPatternReferenceFromUrl(href, sourceUrl, patterns)
      if (reference) references.set(reference.sourceUrl, reference)
    })

  return [...references.values()].slice(0, maximumRelatedPatterns)
}

function getImplementationGuidance($: cheerio.CheerioAPI, content: CheerioContent): string {
  const heading = content
    .find('h2')
    .filter((_, element) => /implementation/i.test(getText($(element))))
    .first()
  if (!heading.length) return ''

  return truncate(getTextFromElements($, heading.nextUntil('h2'), maximumGuidanceItems), maximumImplementationLength)
}

function getGuidanceByKeyword($: cheerio.CheerioAPI, content: CheerioContent, keyword: RegExp): Array<string> {
  const guidance = new Set<string>()

  content.find('p, li').each((_, element) => {
    const text = getText($(element))
    if (keyword.test(text)) guidance.add(truncate(text, maximumGuidanceItemLength))
  })

  return [...guidance].slice(0, maximumGuidanceItems)
}

function getTextFromElements($: cheerio.CheerioAPI, elements: CheerioContent, maximumItems: number): string {
  const text = new Set<string>()

  elements.each((_, element) => {
    const section = $(element)
    if (section.is('p, li')) text.add(getText(section))

    section.find('p, li').each((_, child) => {
      text.add(getText($(child)))
    })
  })

  return [...text].filter(Boolean).slice(0, maximumItems).join(' ')
}

function toPatternReference(pattern: Pattern, sourceUrl: URL): PatternReference {
  return {
    id: pattern.id,
    name: pattern.name,
    category: pattern.category,
    sourceUrl: sourceUrl.toString(),
  }
}

function toPatternReferenceFromUrl(
  href: string,
  sourceUrl: URL,
  patterns: Array<Pattern>,
): PatternReference | undefined {
  const url = new URL(href, sourceUrl)
  if (url.origin !== 'https://primer.style') return undefined

  const match = url.pathname.match(/^\/product\/(scenario-patterns|ui-patterns)\/([^/]+)\/?$/)
  if (!match) return undefined

  const category = match[1] === 'scenario-patterns' ? 'scenario' : 'ui'
  const id = decodeURIComponent(match[2])
  const pattern = patterns.find(candidate => candidate.id === id && candidate.category === category)
  if (!pattern) return undefined

  return toPatternReference(pattern, new URL(url.pathname, url))
}

function toComponentReference(href: string, name: string, sourceUrl: URL): PatternComponentReference | undefined {
  const url = new URL(href, sourceUrl)
  if (url.origin !== 'https://primer.style') return undefined

  const match = url.pathname.match(/^\/product\/(components|internal-components)\/([^/]+)\/?$/)
  if (!match) return undefined

  return {
    id: decodeURIComponent(match[2]),
    name,
    source: match[1] === 'components' ? 'primer-public' : 'primer-internal',
    sourceUrl: new URL(url.pathname, url).toString(),
  }
}

function getText(element: CheerioContent): string {
  return element.text().replace(/\s+/g, ' ').trim()
}

function truncate(value: string, maximumLength: number): string {
  if (value.length <= maximumLength) return value

  return `${value.slice(0, maximumLength - 1).trimEnd()}…`
}
