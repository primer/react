import componentsMetadata from '@primer/react/generated/components.json' with {type: 'json'}
import octicons from '@primer/octicons/build/data.json' with {type: 'json'}

type ComponentDocsSource = 'hosted' | 'package'

type Component = {
  id: string
  name: string
  importPath: string
  slug: string
}

type ComponentSummary = Pick<Component, 'id' | 'name' | 'importPath'> & {
  status?: string
}

interface ComponentDocument {
  name: string
  importPath: string
  [key: string]: unknown
}

interface ComponentRelationship {
  parent?: string
  child?: string
  previous?: string
  next?: string
  first?: string
  second?: string
  component?: string
  subcomponent?: string
  [key: string]: unknown
}

interface CompositionMetadata {
  schemaVersion: number
  derivation: Record<string, unknown>
  sourceSummary: Record<string, unknown>
  apiParentChild: Array<ComponentRelationship>
  apiSubcomponents: Array<ComponentRelationship>
  observed: {
    parentChild: Array<ComponentRelationship>
    adjacentSibling: Array<ComponentRelationship>
    variants: Array<ComponentRelationship>
    relatedComponents: Array<ComponentRelationship>
  }
}

interface ComponentsMetadata {
  components: Record<string, ComponentDocument>
  composition?: CompositionMetadata
}

const metadata: ComponentsMetadata = componentsMetadata
const maximumObservedRelationshipsPerKind = 3

function idToSlug(id: string): string {
  if (id === 'actionbar') {
    return 'action-bar'
  }

  if (id === 'tooltip-v2') {
    return 'tooltip'
  }

  if (id === 'dialog_v2') {
    return 'dialog'
  }

  return id.replaceAll('_', '-')
}

const components: Array<Component> = Object.entries(metadata.components).map(([id, component]) => {
  return {
    id,
    name: component.name,
    importPath: component.importPath,
    slug: idToSlug(id),
  }
})

function listComponents(): Array<Component> {
  return components
}

function getComponentDocsSource(value = process.env.PRIMER_COMPONENT_DOCS_SOURCE): ComponentDocsSource {
  if (value === undefined || value === 'hosted' || value === 'package') {
    return value ?? 'hosted'
  }

  throw new Error('PRIMER_COMPONENT_DOCS_SOURCE must be either "hosted" or "package".')
}

function getComponentDocument(id: string): ComponentDocument | undefined {
  return metadata.components[id]
}

function getComponentSummary(component: Component): ComponentSummary {
  const status = getComponentDocument(component.id)?.status

  return typeof status === 'string'
    ? {id: component.id, name: component.name, importPath: component.importPath, status}
    : {id: component.id, name: component.name, importPath: component.importPath}
}

function getComponentComposition(id: string) {
  const component = getComponentDocument(id)
  const composition = metadata.composition
  if (!component || !composition) return undefined

  return {
    schemaVersion: composition.schemaVersion,
    derivation: composition.derivation,
    sourceSummary: composition.sourceSummary,
    apiParentChild: composition.apiParentChild.filter(relation => includesComponent(relation, component.name)),
    apiSubcomponents: composition.apiSubcomponents.filter(relation => includesComponent(relation, component.name)),
    observed: {
      parentChild: composition.observed.parentChild.filter(relation => includesComponent(relation, component.name)),
      adjacentSibling: composition.observed.adjacentSibling.filter(relation =>
        includesComponent(relation, component.name),
      ),
      variants: composition.observed.variants.filter(relation => includesComponent(relation, component.name)),
      relatedComponents: composition.observed.relatedComponents.filter(relation =>
        includesComponent(relation, component.name),
      ),
    },
  }
}

function getComponentCompositionSummary(id: string) {
  const composition = getComponentComposition(id)
  if (!composition) return undefined

  const parentChild = summarizeObservedRelationships(composition.observed.parentChild)
  const adjacentSibling = summarizeObservedRelationships(composition.observed.adjacentSibling)
  const variants = summarizeObservedRelationships(composition.observed.variants)
  const relatedComponents = summarizeObservedRelationships(composition.observed.relatedComponents)

  return {
    schemaVersion: composition.schemaVersion,
    apiParentChild: composition.apiParentChild.map(compactRelationship),
    apiSubcomponents: composition.apiSubcomponents.map(compactRelationship),
    observed: {
      parentChild: parentChild.relationships,
      adjacentSibling: adjacentSibling.relationships,
      variants: variants.relationships,
      relatedComponents: relatedComponents.relationships,
    },
    observedRelationshipLimit: maximumObservedRelationshipsPerKind,
    omittedObservedRelationshipCounts: {
      parentChild: parentChild.omittedCount,
      adjacentSibling: adjacentSibling.omittedCount,
      variants: variants.omittedCount,
      relatedComponents: relatedComponents.omittedCount,
    },
  }
}

function summarizeObservedRelationships(relationships: Array<ComponentRelationship>) {
  const orderedRelationships = [...relationships].sort((first, second) => {
    return (
      getRelationshipNumber(second, 'sourceCount') - getRelationshipNumber(first, 'sourceCount') ||
      getRelationshipNumber(second, 'occurrences') - getRelationshipNumber(first, 'occurrences') ||
      JSON.stringify(compactRelationship(first)).localeCompare(JSON.stringify(compactRelationship(second)))
    )
  })

  return {
    relationships: orderedRelationships.slice(0, maximumObservedRelationshipsPerKind).map(compactRelationship),
    omittedCount: Math.max(orderedRelationships.length - maximumObservedRelationshipsPerKind, 0),
  }
}

function getRelationshipNumber(relationship: ComponentRelationship, key: string): number {
  const value = relationship[key]
  return typeof value === 'number' ? value : 0
}

function compactRelationship(relationship: ComponentRelationship): ComponentRelationship {
  const compact: ComponentRelationship = {}
  for (const [key, value] of Object.entries(relationship)) {
    if (key !== 'sources') compact[key] = value
  }

  return compact
}

function includesComponent(relation: ComponentRelationship, componentName: string): boolean {
  const componentFields = [
    'parent',
    'child',
    'previous',
    'next',
    'first',
    'second',
    'component',
    'subcomponent',
  ] as const

  return componentFields.some(field => {
    const value = relation[field]
    return value === componentName || value?.startsWith(`${componentName}.`)
  })
}

export interface Pattern {
  id: string
  name: string
  // 'scenario' maps to the /product/scenario-patterns/ base path, 'ui' to /product/ui-patterns/
  category: 'scenario' | 'ui'
}

// Scenario patterns are listed first so name resolution favours them over UI patterns.
const patterns: Array<Pattern> = [
  {
    id: 'copy',
    name: 'Copy',
    category: 'scenario',
  },
  {
    id: 'delete',
    name: 'Delete',
    category: 'scenario',
  },
  {
    id: 'filter',
    name: 'Filter',
    category: 'scenario',
  },
  {
    id: 'search',
    name: 'Search',
    category: 'scenario',
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    category: 'ui',
  },
  {
    id: 'degraded-experiences',
    name: 'Degraded Experiences',
    category: 'ui',
  },
  {
    id: 'empty-states',
    name: 'Empty States',
    category: 'ui',
  },
  {
    id: 'feature-onboarding',
    name: 'Feature Onboarding',
    category: 'ui',
  },
  {
    id: 'forms',
    name: 'Forms',
    category: 'ui',
  },
  {
    id: 'loading',
    name: 'Loading',
    category: 'ui',
  },
  {
    id: 'navigation',
    name: 'Navigation',
    category: 'ui',
  },
  {
    id: 'notification-messaging',
    name: 'Notification message',
    category: 'ui',
  },
  {
    id: 'progressive-disclosure',
    name: 'Progressive disclosure',
    category: 'ui',
  },
  {
    id: 'saving',
    name: 'Saving',
    category: 'ui',
  },
]

function listPatterns(): Array<Pattern> {
  return patterns
}

type Icon = {
  name: string
  keywords: Array<string>
  heights: Array<string>
}

const icons: Array<Icon> = Object.values(octicons).map(icon => {
  return {
    name: icon.name,
    keywords: icon.keywords,
    heights: Object.keys(icon.heights),
  }
})

function listIcons(): Array<Icon> {
  return icons
}

export {
  getComponentComposition,
  getComponentCompositionSummary,
  getComponentDocsSource,
  getComponentDocument,
  getComponentSummary,
  listComponents,
  listPatterns,
  listIcons,
  type ComponentDocsSource,
}
