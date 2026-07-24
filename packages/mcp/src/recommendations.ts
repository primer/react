import type {CompactPatternDetails, PatternComponentReference, PatternReference} from './patterns'
import {getPatternUrl} from './patterns'
import type {Pattern} from './primer'
import {findInternalCatalogEntries, type InternalCatalogResult, type InternalCatalogEntry} from './internalCatalog'

const maximumEvidencePerCandidate = 3
const maximumAuxiliaryEntriesPerResult = 3
const relationshipKeys = [
  'parent',
  'child',
  'previous',
  'next',
  'first',
  'second',
  'component',
  'subcomponent',
] as const

export interface RecommendationInput {
  intent: string
  sourceScope?: 'public' | 'all'
  surface?: string
  region?: string
  patternHints?: Array<string>
  states?: Array<string>
  constraints?: Array<string>
  existingComponents?: Array<string>
  preferredComponents?: Array<string>
  limit?: number
}

export interface RecommendationComponent {
  id: string
  name: string
  importPath: string
  status?: string
  sourceUrl: string
  searchTerms: Array<string>
  composition?: RecommendationComposition
}

export interface RecommendationComposition {
  apiParentChild: Array<RecommendationRelationship>
  apiSubcomponents: Array<RecommendationRelationship>
  observed: Record<string, Array<RecommendationRelationship>>
}

export interface RecommendationRelationship {
  [key: string]: unknown
}

export interface RankedPattern {
  pattern: Pattern
  score: number
  scoreBreakdown: Array<ScoreBreakdown>
}

export interface ScoreBreakdown {
  source: string
  score: number
  matches: Array<string>
}

export interface CandidateEvidence {
  sourceKind: 'pattern' | 'component-metadata' | 'composition' | 'input' | 'internal-catalog'
  sourceUrl?: string
  detail: string
  relationship?: RecommendationRelationship
}

interface CandidateContribution {
  score: number
  scoreBreakdown: Array<ScoreBreakdown>
  evidence: CandidateEvidence
}

export interface ComponentCandidate {
  component: {
    id: string
    name: string
    importPath: string
    sourceKind: 'primer-public'
    sourceUrl: string
  }
  score: number
  scoreBreakdown: Array<ScoreBreakdown>
  evidence: Array<CandidateEvidence>
}

export interface PatternCandidate {
  pattern: PatternReference
  sourceKind: 'primer-style-pattern'
  score: number
  scoreBreakdown: Array<ScoreBreakdown>
}

export interface InternalComponentCandidate {
  component: InternalCatalogEntry & {
    installable: false
  }
  score: number
  scoreBreakdown: Array<ScoreBreakdown>
  evidence: Array<CandidateEvidence>
}

export interface Exclusion {
  name: string
  source: 'primer-public' | 'input'
  reason: 'deprecated' | 'incompatible'
}

export interface UnresolvedReference {
  name: string
  id: string
  source: PatternComponentReference['source']
  sourceUrl: string
  pattern: PatternReference
  reason:
    | 'internal-reference'
    | 'internal-catalog-no-match'
    | 'internal-catalog-unavailable'
    | 'internal-catalog-stale'
    | 'not-in-package'
}

export interface RecommendationResult extends Record<string, unknown> {
  status: 'matched' | 'ambiguous' | 'partial-match' | 'no-match'
  intent: string
  patterns: Array<PatternCandidate>
  components: Array<ComponentCandidate>
  internalComponents: Array<InternalComponentCandidate>
  sourceScope: 'public' | 'all'
  internalCatalog: {
    status: InternalCatalogResult['status']
    sourceRevision?: string
    message?: string
  }
  matchedSignals: Record<string, Array<string>>
  unmetSignals: Array<string>
  confidence: {
    level: 'high' | 'medium' | 'low' | 'none'
    score: number
    scoreBreakdown: Array<ScoreBreakdown>
  }
  exclusions: Array<Exclusion>
  unresolvedReferences: Array<UnresolvedReference>
  nextAction?: string
}

export function rankPatterns(patterns: Array<Pattern>, input: RecommendationInput): Array<RankedPattern> {
  const intentTokens = tokens(input.intent)
  const hintTokens = tokens(input.patternHints ?? [])
  const contextTokens = tokens([input.surface, input.region, ...(input.states ?? []), ...(input.constraints ?? [])])

  return patterns
    .map(pattern => {
      const patternTokens = tokens([pattern.id, pattern.name])
      const intentMatches = intersection(intentTokens, patternTokens)
      const hintMatches = intersection(hintTokens, patternTokens)
      const contextMatches = intersection(contextTokens, patternTokens)
      const scoreBreakdown = [
        score('intent', intentMatches, 10),
        score('pattern-hint', hintMatches, 20),
        score('context', contextMatches, 4),
      ].filter((entry): entry is ScoreBreakdown => entry !== undefined)
      const matchScore = scoreBreakdown.reduce((total, entry) => total + entry.score, 0)

      return {
        pattern,
        score: matchScore === 0 ? 0 : matchScore + (pattern.category === 'scenario' ? 1 : 0),
        scoreBreakdown,
      }
    })
    .filter(candidate => candidate.score > 0)
    .sort(compareRankedPatterns)
}

export function createRecommendation(
  input: RecommendationInput,
  rankedPatterns: Array<RankedPattern>,
  details: Array<CompactPatternDetails>,
  components: Array<RecommendationComponent>,
  internalCatalog: InternalCatalogResult = {status: 'not-requested'},
): RecommendationResult {
  const limit = input.limit ?? 3
  const sourceScope = input.sourceScope ?? 'public'
  const selectedPatterns = rankedPatterns.slice(0, limit)
  const selectedDetails = details.filter(detail =>
    selectedPatterns.some(candidate => candidate.pattern.id === detail.pattern.id),
  )
  const componentByName = new Map(components.map(component => [normalizeIdentifier(component.name), component]))
  const candidates = new Map<string, ComponentCandidate>()
  const internalCandidates = new Map<string, InternalComponentCandidate>()
  const exclusions: Array<Exclusion> = []
  const unresolvedReferences: Array<UnresolvedReference> = []

  for (const detail of selectedDetails) {
    const pattern = selectedPatterns.find(candidate => candidate.pattern.id === detail.pattern.id)
    if (!pattern) continue

    for (const reference of detail.components) {
      if (reference.source === 'primer-internal') {
        const entry = internalCatalog.catalog
          ? findInternalCatalogEntries(internalCatalog.catalog, [reference], limit).at(0)
          : undefined
        if (sourceScope === 'all' && internalCatalog.status === 'available' && entry) {
          addInternalCandidate(internalCandidates, entry, {
            score: pattern.score,
            scoreBreakdown: pattern.scoreBreakdown,
            evidence: {
              sourceKind: 'internal-catalog',
              sourceUrl: entry.sourceUrl,
              detail: `${detail.pattern.name} links to documented internal ${entry.name}.`,
            },
          })
          continue
        }

        unresolvedReferences.push({
          ...reference,
          pattern: detail.pattern,
          reason:
            sourceScope !== 'all'
              ? 'internal-reference'
              : internalCatalog.status === 'stale'
                ? 'internal-catalog-stale'
                : internalCatalog.status === 'unavailable'
                  ? 'internal-catalog-unavailable'
                  : 'internal-catalog-no-match',
        })
        continue
      }

      const component = componentByName.get(normalizeIdentifier(reference.name))
      if (!component) {
        unresolvedReferences.push({
          ...reference,
          pattern: detail.pattern,
          reason: 'not-in-package',
        })
        continue
      }

      if (!isCompatible(component)) {
        exclusions.push({
          name: component.name,
          source: 'primer-public',
          reason: component.status === 'deprecated' ? 'deprecated' : 'incompatible',
        })
        continue
      }

      const metadataMatches = intersection(
        tokens([input.intent, input.surface, input.region, ...(input.states ?? []), ...(input.constraints ?? [])]),
        tokens(component.searchTerms),
      )
      addCandidate(candidates, component, {
        score: pattern.score,
        scoreBreakdown: [...pattern.scoreBreakdown, score('component-metadata', metadataMatches, 2)].filter(
          (entry): entry is ScoreBreakdown => entry !== undefined,
        ),
        evidence: {
          sourceKind: 'pattern',
          sourceUrl: reference.sourceUrl,
          detail: `${detail.pattern.name} links to ${component.name}.`,
        },
      })
    }
  }

  for (const [signal, names] of [
    ['existing-component', input.existingComponents ?? []],
    ['preferred-component', input.preferredComponents ?? []],
  ] as const) {
    for (const name of names) {
      const component = componentByName.get(normalizeIdentifier(name))
      if (!component) continue
      if (!isCompatible(component)) {
        exclusions.push({
          name: component.name,
          source: 'input',
          reason: component.status === 'deprecated' ? 'deprecated' : 'incompatible',
        })
        continue
      }

      addCandidate(candidates, component, {
        score: signal === 'preferred-component' ? 12 : 8,
        scoreBreakdown: [{source: signal, score: signal === 'preferred-component' ? 12 : 8, matches: [component.name]}],
        evidence: {
          sourceKind: 'input',
          detail: `${component.name} was supplied as an ${signal.replace('-', ' ')}.`,
        },
      })
    }
  }

  expandComposition(candidates, componentByName, exclusions)

  const patternCandidates = selectedPatterns.map(candidate => ({
    pattern: {
      id: candidate.pattern.id,
      name: candidate.pattern.name,
      category: candidate.pattern.category,
      sourceUrl: getPatternUrl(candidate.pattern).toString(),
    },
    sourceKind: 'primer-style-pattern' as const,
    score: candidate.score,
    scoreBreakdown: candidate.scoreBreakdown,
  }))
  const componentCandidates = [...candidates.values()]
    .map(candidate => ({
      ...candidate,
      evidence: candidate.evidence.slice(0, maximumEvidencePerCandidate),
    }))
    .sort(compareComponentCandidates)
    .slice(0, limit)
  const internalComponentCandidates = [...internalCandidates.values()]
    .map(candidate => ({
      ...candidate,
      evidence: candidate.evidence.slice(0, maximumEvidencePerCandidate),
    }))
    .sort(compareInternalComponentCandidates)
    .slice(0, limit)
  const matchedSignals = getMatchedSignals(input, patternCandidates, componentCandidates)
  const unmetSignals = getUnmetSignals(input, matchedSignals)
  const ambiguous = patternCandidates.length > 1 && patternCandidates[0].score === patternCandidates[1].score
  const status =
    patternCandidates.length === 0
      ? 'no-match'
      : ambiguous
        ? 'ambiguous'
        : componentCandidates.length === 0
          ? 'partial-match'
          : 'matched'

  return {
    status,
    intent: input.intent,
    patterns: patternCandidates,
    components: componentCandidates,
    internalComponents: internalComponentCandidates,
    sourceScope,
    internalCatalog: {
      status: internalCatalog.status,
      ...(internalCatalog.catalog ? {sourceRevision: internalCatalog.catalog.sourceRevision} : {}),
      ...(internalCatalog.message ? {message: internalCatalog.message} : {}),
    },
    matchedSignals,
    unmetSignals,
    confidence: getConfidence(status, patternCandidates, componentCandidates),
    exclusions: uniqueBy(exclusions, exclusion => `${exclusion.name}:${exclusion.source}:${exclusion.reason}`).slice(
      0,
      maximumAuxiliaryEntriesPerResult,
    ),
    unresolvedReferences: uniqueBy(
      unresolvedReferences,
      reference => `${reference.pattern.id}:${reference.source}:${reference.id}:${reference.sourceUrl}`,
    ).slice(0, maximumAuxiliaryEntriesPerResult),
    nextAction:
      status === 'no-match'
        ? 'Try a known Primer pattern name or add a pattern hint.'
        : status === 'ambiguous'
          ? 'Add a pattern hint, surface, or state to choose between the equally ranked patterns.'
          : status === 'partial-match'
            ? internalComponentCandidates.length > 0
              ? 'Review the documented GitHub-only internal candidates; they have no public installable import.'
              : 'Review the matched pattern guidance; it does not link to a compatible public Primer component.'
            : undefined,
  }
}

export function formatRecommendation(result: RecommendationResult): string {
  if (result.status === 'no-match') {
    return `No Primer pattern matched "${result.intent}". ${result.nextAction}`
  }

  const patterns = result.patterns.map(candidate => `- ${candidate.pattern.name} (${candidate.score})`).join('\n')
  const components = result.components
    .map(candidate => `- ${candidate.component.name} (${candidate.score}): ${candidate.component.sourceUrl}`)
    .join('\n')
  const unresolved = result.unresolvedReferences
    .map(reference => `- ${reference.name} (${reference.source}): ${reference.sourceUrl}`)
    .join('\n')
  const internal = result.internalComponents
    .map(
      candidate =>
        `- ${candidate.component.name} (${candidate.component.visibility}; not installable): ${candidate.component.sourceUrl}`,
    )
    .join('\n')

  return [
    `Recommendation confidence: ${result.confidence.level} (${result.confidence.score}/100).`,
    patterns && `Patterns:\n${patterns}`,
    components && `Public components:\n${components}`,
    internal && `Documented internal candidates (GitHub-only; no public import):\n${internal}`,
    unresolved && `Unresolved references:\n${unresolved}`,
    result.nextAction,
  ]
    .filter((section): section is string => Boolean(section))
    .join('\n\n')
}

function expandComposition(
  candidates: Map<string, ComponentCandidate>,
  componentByName: Map<string, RecommendationComponent>,
  exclusions: Array<Exclusion>,
) {
  const expandedRelationships = new Set<string>()

  for (const candidate of [...candidates.values()]) {
    const source = componentByName.get(normalizeIdentifier(candidate.component.name))
    if (!source?.composition) continue

    for (const [kind, relationships] of getRelationships(source.composition)) {
      for (const relationship of relationships.slice(0, maximumEvidencePerCandidate)) {
        for (const relatedName of getRelatedComponentNames(relationship, source.name)) {
          const related = componentByName.get(normalizeIdentifier(relatedName))
          if (!related || related.name === source.name) continue
          const relationshipKey = `${source.name}:${kind}:${related.name}`
          if (expandedRelationships.has(relationshipKey)) continue
          expandedRelationships.add(relationshipKey)

          if (!isCompatible(related)) {
            exclusions.push({
              name: related.name,
              source: 'primer-public',
              reason: related.status === 'deprecated' ? 'deprecated' : 'incompatible',
            })
            continue
          }

          addCandidate(candidates, related, {
            score: 1,
            scoreBreakdown: [{source: `composition:${kind}`, score: 1, matches: [source.name, related.name]}],
            evidence: {
              sourceKind: 'composition',
              detail: `${kind} relates ${source.name} and ${related.name}.`,
              relationship,
            },
          })
        }
      }
    }
  }
}

function getRelationships(composition: RecommendationComposition): Array<[string, Array<RecommendationRelationship>]> {
  return [
    ['api-parent-child', composition.apiParentChild],
    ['api-subcomponents', composition.apiSubcomponents],
    ...Object.entries(composition.observed).map(
      ([kind, relationships]): [string, Array<RecommendationRelationship>] => [`observed:${kind}`, relationships],
    ),
  ]
}

function getRelatedComponentNames(relationship: RecommendationRelationship, componentName: string): Array<string> {
  return relationshipKeys
    .map(key => relationship[key])
    .filter((value): value is string => typeof value === 'string')
    .map(value => value.split('.')[0] ?? value)
    .filter(name => name !== componentName)
}

function addCandidate(
  candidates: Map<string, ComponentCandidate>,
  component: RecommendationComponent,
  contribution: CandidateContribution,
) {
  const key = normalizeIdentifier(component.name)
  const current = candidates.get(key)
  if (current) {
    current.score += contribution.score
    current.scoreBreakdown.push(...contribution.scoreBreakdown)
    current.evidence.push(contribution.evidence)
    return
  }

  candidates.set(key, {
    component: {
      id: component.id,
      name: component.name,
      importPath: component.importPath,
      sourceKind: 'primer-public',
      sourceUrl: component.sourceUrl,
    },
    score: contribution.score,
    scoreBreakdown: contribution.scoreBreakdown,
    evidence: [contribution.evidence],
  })
}

function addInternalCandidate(
  candidates: Map<string, InternalComponentCandidate>,
  component: InternalCatalogEntry,
  contribution: CandidateContribution,
) {
  const key = normalizeIdentifier(component.name)
  const current = candidates.get(key)
  if (current) {
    current.score += contribution.score
    current.scoreBreakdown.push(...contribution.scoreBreakdown)
    current.evidence.push(contribution.evidence)
    return
  }

  candidates.set(key, {
    component: {...component, installable: false},
    score: contribution.score,
    scoreBreakdown: contribution.scoreBreakdown,
    evidence: [contribution.evidence],
  })
}

function getMatchedSignals(
  input: RecommendationInput,
  patterns: Array<PatternCandidate>,
  components: Array<ComponentCandidate>,
): Record<string, Array<string>> {
  const selectedPatternTerms = tokens(patterns.map(candidate => `${candidate.pattern.id} ${candidate.pattern.name}`))
  const selectedComponentTerms = tokens([
    ...components.map(candidate => candidate.component.name),
    ...components.flatMap(candidate => candidate.scoreBreakdown.flatMap(breakdown => breakdown.matches)),
  ])
  const selectedTerms = new Set([...selectedPatternTerms, ...selectedComponentTerms])
  const match = (values: Array<string>) => values.filter(value => intersection(tokens(value), selectedTerms).length > 0)

  return {
    intent: intersection(tokens(input.intent), selectedTerms),
    surface: match([input.surface, input.region].filter((value): value is string => Boolean(value))),
    patternHints: match(input.patternHints ?? []),
    states: match(input.states ?? []),
    constraints: match(input.constraints ?? []),
    existingComponents: match(input.existingComponents ?? []),
    preferredComponents: match(input.preferredComponents ?? []),
  }
}

function getUnmetSignals(input: RecommendationInput, matched: Record<string, Array<string>>): Array<string> {
  const signals = [
    ['surface', [input.surface, input.region].filter((value): value is string => Boolean(value))],
    ['pattern hint', input.patternHints ?? []],
    ['state', input.states ?? []],
    ['constraint', input.constraints ?? []],
    ['existing component', input.existingComponents ?? []],
    ['preferred component', input.preferredComponents ?? []],
  ] as const

  return signals.flatMap(([label, values]) => {
    const key =
      label === 'pattern hint'
        ? 'patternHints'
        : label === 'existing component'
          ? 'existingComponents'
          : label === 'preferred component'
            ? 'preferredComponents'
            : label
    const matchedValues = matched[key] ?? []
    return values.filter(value => !matchedValues.includes(value)).map(value => `${label}: ${value}`)
  })
}

function getConfidence(
  status: RecommendationResult['status'],
  patterns: Array<PatternCandidate>,
  components: Array<ComponentCandidate>,
): RecommendationResult['confidence'] {
  if (status === 'no-match') return {level: 'none', score: 0, scoreBreakdown: []}

  const topPattern = patterns.at(0)
  const topComponent = components.at(0)
  const score = Math.min(100, (topPattern?.score ?? 0) + (topComponent ? 20 : 0))
  const level = score >= 40 ? 'high' : score >= 20 ? 'medium' : 'low'

  return {
    level,
    score,
    scoreBreakdown: [...(topPattern?.scoreBreakdown ?? []), ...(topComponent?.scoreBreakdown ?? [])],
  }
}

function score(source: string, matches: Array<string>, weight: number): ScoreBreakdown | undefined {
  return matches.length > 0 ? {source, score: matches.length * weight, matches} : undefined
}

function tokens(values: string | Array<string | undefined>): Set<string> {
  const text = Array.isArray(values) ? values.filter((value): value is string => Boolean(value)).join(' ') : values
  return new Set(
    text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .flatMap(token => [token, stem(token)])
      .filter(token => token.length > 1),
  )
}

function stem(token: string): string {
  if (token.endsWith('ing') && token.length > 5) return token.slice(0, -3)
  if (token.endsWith('es') && token.length > 4) return token.slice(0, -2)
  if (token.endsWith('s') && token.length > 3) return token.slice(0, -1)
  return token
}

function intersection(first: Set<string>, second: Set<string>): Array<string> {
  return [...first].filter(value => second.has(value)).sort((a, b) => a.localeCompare(b))
}

function normalizeIdentifier(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase()
}

function isCompatible(component: RecommendationComponent): boolean {
  return component.importPath === '@primer/react' && component.status !== 'deprecated'
}

function compareRankedPatterns(first: RankedPattern, second: RankedPattern): number {
  return second.score - first.score || first.pattern.name.localeCompare(second.pattern.name)
}

function compareComponentCandidates(first: ComponentCandidate, second: ComponentCandidate): number {
  return second.score - first.score || first.component.name.localeCompare(second.component.name)
}

function compareInternalComponentCandidates(
  first: InternalComponentCandidate,
  second: InternalComponentCandidate,
): number {
  return second.score - first.score || first.component.name.localeCompare(second.component.name)
}

function uniqueBy<Value>(values: Array<Value>, key: (value: Value) => string): Array<Value> {
  return [...new Map(values.map(value => [key(value), value])).values()]
}
