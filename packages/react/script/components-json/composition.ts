import {parse} from '@babel/parser'
import {traverse} from '@babel/core'
import type {JSXAttribute, JSXElement, JSXOpeningElement, Node} from '@babel/types'
import fs from 'node:fs'
import glob from 'fast-glob'

const minimumSourceCount = 2
const highConfidenceSourceCount = 3

type SourceKind = 'story' | 'example' | 'test' | 'implementation'

interface ComponentProp {
  name: string
  type: string
  required?: boolean
}

interface DocumentedSubcomponent {
  name: string
  props: Array<ComponentProp>
}

export interface DocumentedComponent {
  name: string
  props: Array<ComponentProp>
  sourcePath: string
  subcomponents?: Array<DocumentedSubcomponent>
}

export interface CompositionSource {
  kind: SourceKind
  path: string
}

interface RelationshipSource {
  kind: SourceKind
  path: string
}

interface ObservedParentChildRelationship {
  parent: string
  child: string
  occurrences: number
  sourceCount: number
  confidence: 'medium' | 'high'
  sources: Array<RelationshipSource>
}

interface ObservedSiblingRelationship {
  parent: string
  previous: string
  next: string
  occurrences: number
  sourceCount: number
  confidence: 'medium' | 'high'
  sources: Array<RelationshipSource>
}

interface ObservedVariantRelationship {
  component: string
  prop: string
  value: string
  occurrences: number
  sourceCount: number
  confidence: 'medium' | 'high'
  sources: Array<RelationshipSource>
}

interface ObservedRelatedComponentsRelationship {
  first: string
  second: string
  relationshipKinds: Array<'parentChild' | 'adjacentSibling'>
  occurrences: number
  sourceCount: number
  confidence: 'medium' | 'high'
  sources: Array<RelationshipSource>
}

interface ApiParentChildRelationship {
  parent: string
  child: string
  childrenPropRequired: boolean
  source: {
    path: string
    prop: string
    type: string
  }
}

interface ApiSubcomponentRelationship {
  parent: string
  subcomponent: string
  source: {
    path: string
  }
}

export interface CompositionMetadata {
  schemaVersion: 1
  derivation: {
    sourceKinds: Array<SourceKind>
    minimumSourceCount: number
    highConfidenceSourceCount: number
  }
  sourceSummary: {
    componentMetadataFiles: number
    sourceUnits: number
    sourceUnitsByKind: Record<SourceKind, number>
  }
  apiParentChild: Array<ApiParentChildRelationship>
  apiSubcomponents: Array<ApiSubcomponentRelationship>
  observed: {
    parentChild: Array<ObservedParentChildRelationship>
    adjacentSibling: Array<ObservedSiblingRelationship>
    variants: Array<ObservedVariantRelationship>
    relatedComponents: Array<ObservedRelatedComponentsRelationship>
  }
}

interface RelationshipAccumulator {
  occurrences: number
  sources: Map<string, RelationshipSource>
}

interface RelatedComponentsAccumulator extends RelationshipAccumulator {
  relationshipKinds: Set<'parentChild' | 'adjacentSibling'>
}

export function getCompositionSources(docsFiles: Array<string>): Array<CompositionSource> {
  const componentDirectories = [...new Set(docsFiles.map(getComponentDirectory))]
  const storySources = docsFiles.flatMap(docsFile => {
    const basePath = docsFile.replace(/\.docs\.json$/, '')

    return [
      {kind: 'story' as const, path: `${basePath}.stories.tsx`},
      {kind: 'story' as const, path: `${basePath}.features.stories.tsx`},
      {kind: 'example' as const, path: `${basePath}.examples.stories.tsx`},
    ]
  })
  const testSources = glob
    .sync(componentDirectories.map(directory => `${directory}/**/*.test.tsx`))
    .map(path => ({kind: 'test' as const, path}))
  const implementationSources = glob
    .sync(componentDirectories.map(directory => `${directory}/**/*.tsx`))
    .filter(isImplementationSource)
    .map(path => ({kind: 'implementation' as const, path}))

  const sources: Array<CompositionSource> = [...storySources, ...testSources, ...implementationSources]

  return sources
    .filter(source => fs.existsSync(source.path))
    .sort(compareSources)
    .filter((source, index, sortedSources) => {
      return (
        index === 0 ||
        `${source.kind}\0${source.path}` !== `${sortedSources[index - 1].kind}\0${sortedSources[index - 1].path}`
      )
    })
}

export function buildComposition(
  components: Array<DocumentedComponent>,
  sources: Array<CompositionSource>,
  readFile: (path: string) => string = path => fs.readFileSync(path, 'utf8'),
): CompositionMetadata {
  const componentNames = getComponentNames(components)
  const uniqueSources = [...sources].sort(compareSources).filter((source, index, sortedSources) => {
    return (
      index === 0 ||
      `${source.kind}\0${source.path}` !== `${sortedSources[index - 1].kind}\0${sortedSources[index - 1].path}`
    )
  })
  const parentChild = new Map<string, RelationshipAccumulator>()
  const adjacentSibling = new Map<string, RelationshipAccumulator>()
  const variants = new Map<string, RelationshipAccumulator>()
  const relatedComponents = new Map<string, RelatedComponentsAccumulator>()

  for (const source of uniqueSources) {
    const sourceCode = readFile(source.path)
    const relationships = extractObservedRelationships(sourceCode, componentNames)

    for (const relationship of relationships.parentChild) {
      addRelationship(parentChild, `${relationship.parent}\0${relationship.child}`, source)
      addRelatedComponents(relatedComponents, relationship.parent, relationship.child, 'parentChild', source)
    }

    for (const relationship of relationships.adjacentSibling) {
      addRelationship(adjacentSibling, `${relationship.parent}\0${relationship.previous}\0${relationship.next}`, source)
      addRelatedComponents(relatedComponents, relationship.previous, relationship.next, 'adjacentSibling', source)
    }

    for (const variant of relationships.variants) {
      addRelationship(variants, `${variant.component}\0${variant.prop}\0${variant.value}`, source)
    }
  }

  return {
    schemaVersion: 1,
    derivation: {
      sourceKinds: [...new Set(uniqueSources.map(source => source.kind))].sort(),
      minimumSourceCount,
      highConfidenceSourceCount,
    },
    sourceSummary: {
      componentMetadataFiles: components.length,
      sourceUnits: uniqueSources.length,
      sourceUnitsByKind: {
        story: uniqueSources.filter(source => source.kind === 'story').length,
        example: uniqueSources.filter(source => source.kind === 'example').length,
        test: uniqueSources.filter(source => source.kind === 'test').length,
        implementation: uniqueSources.filter(source => source.kind === 'implementation').length,
      },
    },
    apiParentChild: getApiParentChildRelationships(components, componentNames),
    apiSubcomponents: getApiSubcomponentRelationships(components),
    observed: {
      parentChild: toParentChildRelationships(parentChild),
      adjacentSibling: toSiblingRelationships(adjacentSibling),
      variants: toVariantRelationships(variants),
      relatedComponents: toRelatedComponentsRelationships(relatedComponents),
    },
  }
}

function getComponentDirectory(docsFile: string): string {
  return docsFile.slice(0, docsFile.lastIndexOf('/'))
}

function isImplementationSource(path: string): boolean {
  return (
    !path.includes('.stories.') &&
    !path.includes('.test.') &&
    !path.includes('.figma.') &&
    !path.includes('.dev.stories.')
  )
}

function getComponentNames(components: Array<DocumentedComponent>): Set<string> {
  return new Set(
    components.flatMap(component => [
      component.name,
      ...(component.subcomponents?.map(subcomponent => subcomponent.name) ?? []),
    ]),
  )
}

function getApiParentChildRelationships(
  components: Array<DocumentedComponent>,
  componentNames: Set<string>,
): Array<ApiParentChildRelationship> {
  const relationships = components.flatMap(component => {
    const documentedComponents = [{name: component.name, props: component.props}, ...(component.subcomponents ?? [])]

    return documentedComponents.flatMap(documentedComponent => {
      const childrenProp = documentedComponent.props.find(prop => prop.name === 'children')
      if (!childrenProp) return []

      return getComponentReferences(childrenProp.type, componentNames)
        .filter(child => child !== documentedComponent.name)
        .map(child => ({
          parent: documentedComponent.name,
          child,
          childrenPropRequired: childrenProp.required === true,
          source: {
            path: component.sourcePath,
            prop: childrenProp.name,
            type: childrenProp.type,
          },
        }))
    })
  })

  return relationships
    .sort((a, b) => {
      return (
        a.parent.localeCompare(b.parent) || a.child.localeCompare(b.child) || a.source.path.localeCompare(b.source.path)
      )
    })
    .filter((relationship, index, sortedRelationships) => {
      const previous = sortedRelationships[index - 1]
      return (
        index === 0 ||
        relationship.parent !== previous.parent ||
        relationship.child !== previous.child ||
        relationship.source.path !== previous.source.path
      )
    })
}

function getApiSubcomponentRelationships(components: Array<DocumentedComponent>): Array<ApiSubcomponentRelationship> {
  return components
    .flatMap(component =>
      (component.subcomponents ?? []).map(subcomponent => ({
        parent: component.name,
        subcomponent: subcomponent.name,
        source: {path: component.sourcePath},
      })),
    )
    .sort((a, b) => {
      return (
        a.parent.localeCompare(b.parent) ||
        a.subcomponent.localeCompare(b.subcomponent) ||
        a.source.path.localeCompare(b.source.path)
      )
    })
    .filter((relationship, index, sortedRelationships) => {
      const previous = sortedRelationships[index - 1]
      return (
        index === 0 ||
        relationship.parent !== previous.parent ||
        relationship.subcomponent !== previous.subcomponent ||
        relationship.source.path !== previous.source.path
      )
    })
}

function getComponentReferences(type: string, componentNames: Set<string>): Array<string> {
  return [...componentNames]
    .sort((a, b) => b.length - a.length || a.localeCompare(b))
    .filter(name => {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`(^|[^A-Za-z0-9_.])${escapedName}(?=$|[^A-Za-z0-9_.])`).test(type)
    })
}

function extractObservedRelationships(sourceCode: string, componentNames: Set<string>) {
  const ast = parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  const aliases = getImportAliases(ast, componentNames)
  const parentChild: Array<{parent: string; child: string}> = []
  const adjacentSibling: Array<{parent: string; previous: string; next: string}> = []
  const variants: Array<{component: string; prop: string; value: string}> = []

  traverse(ast, {
    JSXElement(path) {
      if (path.findParent(parentPath => parentPath.isJSXElement())) return

      walkElement(path.node, undefined, aliases, componentNames, parentChild, adjacentSibling, variants)
    },
  })

  return {parentChild, adjacentSibling, variants}
}

function getImportAliases(ast: Node, componentNames: Set<string>): Map<string, string | undefined> {
  const aliases = new Map<string, string | undefined>()

  traverse(ast, {
    ImportDeclaration(path) {
      for (const specifier of path.node.specifiers) {
        if (specifier.type === 'ImportSpecifier' && specifier.imported.type === 'Identifier') {
          if (componentNames.has(specifier.imported.name)) {
            aliases.set(specifier.local.name, specifier.imported.name)
          }
        } else if (specifier.type === 'ImportDefaultSpecifier' && componentNames.has(specifier.local.name)) {
          aliases.set(specifier.local.name, specifier.local.name)
        } else if (specifier.type === 'ImportNamespaceSpecifier') {
          aliases.set(specifier.local.name, undefined)
        }
      }
    },
  })

  return aliases
}

function walkElement(
  element: JSXElement,
  parent: string | undefined,
  aliases: Map<string, string | undefined>,
  componentNames: Set<string>,
  parentChild: Array<{parent: string; child: string}>,
  adjacentSibling: Array<{parent: string; previous: string; next: string}>,
  variants: Array<{component: string; prop: string; value: string}>,
) {
  const component = resolveComponentName(element.openingElement.name, aliases, componentNames)
  const nearestComponent = component ?? parent

  if (parent && component) {
    parentChild.push({parent, child: component})
  }

  if (component) {
    variants.push(...getStaticVariants(component, element.openingElement))
  }

  const directChildren = getDirectChildElements(element.children)
  if (component) {
    const directChildComponents = directChildren
      .map(child => resolveComponentName(child.openingElement.name, aliases, componentNames))
      .filter((child): child is string => child !== undefined)

    for (let index = 1; index < directChildComponents.length; index += 1) {
      adjacentSibling.push({
        parent: component,
        previous: directChildComponents[index - 1],
        next: directChildComponents[index],
      })
    }
  }

  for (const child of directChildren) {
    walkElement(child, nearestComponent, aliases, componentNames, parentChild, adjacentSibling, variants)
  }
}

function getStaticVariants(
  component: string,
  openingElement: JSXOpeningElement,
): Array<{component: string; prop: string; value: string}> {
  return openingElement.attributes.flatMap(attribute => {
    if (
      attribute.type !== 'JSXAttribute' ||
      attribute.name.type !== 'JSXIdentifier' ||
      (attribute.name.name !== 'variant' && !attribute.name.name.endsWith('Variant'))
    ) {
      return []
    }

    const value = getStaticAttributeValue(attribute.value)
    return value === undefined ? [] : [{component, prop: attribute.name.name, value}]
  })
}

function getStaticAttributeValue(attributeValue: JSXAttribute['value']): string | undefined {
  if (!attributeValue) return 'true'
  if (attributeValue.type === 'StringLiteral') return attributeValue.value
  if (attributeValue.type !== 'JSXExpressionContainer') return undefined

  const {expression} = attributeValue
  if (
    expression.type === 'StringLiteral' ||
    expression.type === 'NumericLiteral' ||
    expression.type === 'BooleanLiteral'
  ) {
    return String(expression.value)
  }

  if (expression.type === 'TemplateLiteral' && expression.expressions.length === 0) {
    return expression.quasis[0]?.value.cooked ?? expression.quasis[0]?.value.raw
  }

  return undefined
}

function getDirectChildElements(children: Array<JSXElement['children'][number]>): Array<JSXElement> {
  return children.flatMap(child => {
    if (child.type === 'JSXElement') return [child]
    if (child.type === 'JSXFragment') return getDirectChildElements(child.children)
    if (child.type === 'JSXExpressionContainer') return getJSXElements(child.expression)
    return []
  })
}

function getJSXElements(node: Node | null | undefined): Array<JSXElement> {
  if (!node || typeof node !== 'object') return []
  if (node.type === 'JSXElement') return [node]
  if (node.type === 'JSXFragment') return getDirectChildElements(node.children)

  return Object.values(node).flatMap(value => {
    if (Array.isArray(value)) {
      return value.flatMap(item => getJSXElements(item as Node))
    }

    return getJSXElements(value as Node)
  })
}

function resolveComponentName(
  name: JSXOpeningElement['name'],
  aliases: Map<string, string | undefined>,
  componentNames: Set<string>,
): string | undefined {
  const parts = getJSXNameParts(name)
  if (!parts) return undefined

  const alias = aliases.get(parts[0])
  const [root, suffix] =
    aliases.has(parts[0]) && alias === undefined ? [parts[1], parts.slice(2)] : [alias ?? parts[0], parts.slice(1)]

  if (!root) return undefined

  const componentName = [root, ...suffix].join('.')
  return componentNames.has(componentName) ? componentName : undefined
}

function getJSXNameParts(name: JSXOpeningElement['name']): Array<string> | undefined {
  if (name.type === 'JSXIdentifier') return [name.name]
  if (name.type === 'JSXNamespacedName') return undefined

  const objectParts = getJSXNameParts(name.object)
  return objectParts ? [...objectParts, name.property.name] : undefined
}

function addRelationship(relationships: Map<string, RelationshipAccumulator>, key: string, source: RelationshipSource) {
  const relationship = relationships.get(key) ?? {occurrences: 0, sources: new Map()}
  relationship.occurrences += 1
  relationship.sources.set(`${source.kind}\0${source.path}`, {kind: source.kind, path: source.path})
  relationships.set(key, relationship)
}

function addRelatedComponents(
  relationships: Map<string, RelatedComponentsAccumulator>,
  first: string,
  second: string,
  relationshipKind: 'parentChild' | 'adjacentSibling',
  source: RelationshipSource,
) {
  if (first === second) return

  const [sortedFirst, sortedSecond] = [first, second].sort((a, b) => a.localeCompare(b))
  const key = `${sortedFirst}\0${sortedSecond}`
  const relationship = relationships.get(key) ?? {occurrences: 0, sources: new Map(), relationshipKinds: new Set()}
  relationship.occurrences += 1
  relationship.sources.set(`${source.kind}\0${source.path}`, {kind: source.kind, path: source.path})
  relationship.relationshipKinds.add(relationshipKind)
  relationships.set(key, relationship)
}

function toParentChildRelationships(
  relationships: Map<string, RelationshipAccumulator>,
): Array<ObservedParentChildRelationship> {
  return [...relationships]
    .flatMap(([key, relationship]) => {
      const [parent, child] = key.split('\0')
      return relationship.sources.size >= minimumSourceCount
        ? [
            {
              parent,
              child,
              occurrences: relationship.occurrences,
              sourceCount: relationship.sources.size,
              confidence: getConfidence(relationship.sources.size),
              sources: [...relationship.sources.values()].sort(compareSources),
            },
          ]
        : []
    })
    .sort((a, b) => a.parent.localeCompare(b.parent) || a.child.localeCompare(b.child))
}

function toSiblingRelationships(
  relationships: Map<string, RelationshipAccumulator>,
): Array<ObservedSiblingRelationship> {
  return [...relationships]
    .flatMap(([key, relationship]) => {
      const [parent, previous, next] = key.split('\0')
      return relationship.sources.size >= minimumSourceCount
        ? [
            {
              parent,
              previous,
              next,
              occurrences: relationship.occurrences,
              sourceCount: relationship.sources.size,
              confidence: getConfidence(relationship.sources.size),
              sources: [...relationship.sources.values()].sort(compareSources),
            },
          ]
        : []
    })
    .sort((a, b) => {
      return a.parent.localeCompare(b.parent) || a.previous.localeCompare(b.previous) || a.next.localeCompare(b.next)
    })
}

function toVariantRelationships(
  relationships: Map<string, RelationshipAccumulator>,
): Array<ObservedVariantRelationship> {
  return [...relationships]
    .flatMap(([key, relationship]) => {
      const [component, prop, value] = key.split('\0')
      return relationship.sources.size >= minimumSourceCount
        ? [
            {
              component,
              prop,
              value,
              occurrences: relationship.occurrences,
              sourceCount: relationship.sources.size,
              confidence: getConfidence(relationship.sources.size),
              sources: [...relationship.sources.values()].sort(compareSources),
            },
          ]
        : []
    })
    .sort((a, b) => {
      return a.component.localeCompare(b.component) || a.prop.localeCompare(b.prop) || a.value.localeCompare(b.value)
    })
}

function toRelatedComponentsRelationships(
  relationships: Map<string, RelatedComponentsAccumulator>,
): Array<ObservedRelatedComponentsRelationship> {
  return [...relationships]
    .flatMap(([key, relationship]) => {
      const [first, second] = key.split('\0')
      return relationship.sources.size >= minimumSourceCount
        ? [
            {
              first,
              second,
              relationshipKinds: [...relationship.relationshipKinds].sort(),
              occurrences: relationship.occurrences,
              sourceCount: relationship.sources.size,
              confidence: getConfidence(relationship.sources.size),
              sources: [...relationship.sources.values()].sort(compareSources),
            },
          ]
        : []
    })
    .sort((a, b) => a.first.localeCompare(b.first) || a.second.localeCompare(b.second))
}

function getConfidence(sourceCount: number): 'medium' | 'high' {
  return sourceCount >= highConfidenceSourceCount ? 'high' : 'medium'
}

function compareSources(a: CompositionSource, b: CompositionSource): number {
  return a.path.localeCompare(b.path) || a.kind.localeCompare(b.kind)
}
