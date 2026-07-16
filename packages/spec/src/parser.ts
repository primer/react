import type {Heading, Link, Root} from 'mdast'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toString} from 'mdast-util-to-string'
import {visit} from 'unist-util-visit'
import type {
  ComponentSpec,
  SpecDiagnostic,
  SpecDiagnosticCode,
  SpecFeature,
  SpecFeatureLink,
  SpecFeatureSections,
  SpecIndex,
  SpecLocation,
  SpecParseResult,
  SpecSection,
} from './types'

interface HeadingRecord {
  readonly node: Heading
  readonly childIndex: number
  readonly text: string
  readonly normalized: string
}

interface ParsedDocument {
  readonly root: Root
  readonly headings: readonly HeadingRecord[]
}

const topLevelHeadings = new Set(['accessibility', 'features', 'glossary'])
const featureSectionHeadings = new Set(['markup', 'behavior', 'public api', 'accessibility'])
const forbiddenHeadings = new Set(['verification', 'ssr', 'server rendering', 'server-side rendering'])

export function parseComponentSpec(source: string, path = 'SPEC.md'): SpecParseResult {
  const document = parseDocument(source)
  const diagnostics: SpecDiagnostic[] = []
  validateForbiddenHeadings(document.headings, path, diagnostics)

  const title = validateDocumentTitle(document, source, path, diagnostics)
  const componentName = title === null ? null : parseComponentName(title, path, diagnostics)
  const description = title === null ? '' : getIntroMarkdown(source, document.root, title)

  if (title !== null && isEmptyMarkdown(description)) {
    diagnostics.push(
      createDiagnostic('empty-description', 'The component spec must include a description.', path, title),
    )
  }

  const topLevel = document.headings.filter(heading => heading.node.depth === 2)
  validateAllowedHeadings(topLevel, topLevelHeadings, path, diagnostics)

  const accessibilityHeading = findUniqueHeading(topLevel, 'accessibility', path, diagnostics)
  const featuresHeading = findUniqueHeading(topLevel, 'features', path, diagnostics)
  const glossaryHeading = findUniqueHeading(topLevel, 'glossary', path, diagnostics)

  if (featuresHeading === null) {
    diagnostics.push(
      createDiagnostic(
        'missing-features',
        'The component spec must include a level-two Features section.',
        path,
        title,
      ),
    )
  }

  const features =
    featuresHeading === null
      ? []
      : parseFeatures(source, document.root, document.headings, featuresHeading, path, diagnostics)

  validateDefaultFeature(features, path, featuresHeading ?? title, diagnostics)

  const spec =
    componentName === null
      ? null
      : {
          name: componentName,
          description,
          accessibility: createOptionalSection(source, document.root, accessibilityHeading, path, diagnostics),
          features,
          glossary: createOptionalSection(source, document.root, glossaryHeading, path, diagnostics),
          format: 'single' as const,
          entryPath: path,
          files: [path],
        }

  return createResult(spec, diagnostics)
}

export function parseSpecIndex(source: string, path = 'spec/README.md'): SpecParseResult<SpecIndex> {
  const document = parseDocument(source)
  const diagnostics: SpecDiagnostic[] = []
  validateForbiddenHeadings(document.headings, path, diagnostics)

  const title = validateDocumentTitle(document, source, path, diagnostics)
  const componentName = title === null ? null : parseComponentName(title, path, diagnostics)
  const description = title === null ? '' : getIntroMarkdown(source, document.root, title)

  if (title !== null && isEmptyMarkdown(description)) {
    diagnostics.push(createDiagnostic('empty-description', 'The spec index must include a description.', path, title))
  }

  const topLevel = document.headings.filter(heading => heading.node.depth === 2)
  validateAllowedHeadings(topLevel, topLevelHeadings, path, diagnostics)

  const accessibilityHeading = findUniqueHeading(topLevel, 'accessibility', path, diagnostics)
  const featuresHeading = findUniqueHeading(topLevel, 'features', path, diagnostics)
  const glossaryHeading = findUniqueHeading(topLevel, 'glossary', path, diagnostics)

  if (featuresHeading === null) {
    diagnostics.push(
      createDiagnostic('missing-features', 'The spec index must include a level-two Features section.', path, title),
    )
  }

  const featureLinks =
    featuresHeading === null ? [] : parseFeatureLinks(document.root, featuresHeading, path, diagnostics)

  validateDefaultFeatureLinks(featureLinks, path, featuresHeading ?? title, diagnostics)

  const index =
    componentName === null
      ? null
      : {
          name: componentName,
          description,
          accessibility: createOptionalSection(source, document.root, accessibilityHeading, path, diagnostics),
          features: featureLinks,
          glossary: createOptionalSection(source, document.root, glossaryHeading, path, diagnostics),
          path,
        }

  return createResult(index, diagnostics)
}

export function parseFeatureSpec(source: string, path = 'spec/feature.md'): SpecParseResult<SpecFeature> {
  const document = parseDocument(source)
  const diagnostics: SpecDiagnostic[] = []
  validateForbiddenHeadings(document.headings, path, diagnostics)

  const title = validateFeatureTitle(document, path, diagnostics)
  const description = title === null ? '' : getIntroMarkdown(source, document.root, title)

  if (title !== null && isEmptyMarkdown(description)) {
    diagnostics.push(createDiagnostic('empty-description', 'The feature spec must include a description.', path, title))
  }

  const sectionHeadings = document.headings.filter(heading => heading.node.depth === 2)
  validateAllowedHeadings(sectionHeadings, featureSectionHeadings, path, diagnostics)
  const sections = parseFeatureSections(source, document.root, sectionHeadings, path, diagnostics)

  if (sectionHeadings.length === 0) {
    diagnostics.push(
      createDiagnostic(
        'unexpected-heading',
        'The feature spec must include at least one Markup, Behavior, Public API, or Accessibility section.',
        path,
        title,
      ),
    )
  }

  const feature =
    title === null
      ? null
      : {
          name: title.text,
          description,
          sections,
          location: createLocation(path, title),
          path,
        }

  return createResult(feature, diagnostics)
}

export function createSplitComponentSpec(
  index: SpecIndex,
  features: readonly SpecFeature[],
  files: readonly string[],
): ComponentSpec {
  return {
    name: index.name,
    description: index.description,
    accessibility: index.accessibility,
    features,
    glossary: index.glossary,
    format: 'split',
    entryPath: index.path,
    files,
  }
}

function parseDocument(source: string): ParsedDocument {
  const root = fromMarkdown(source)
  const headings: HeadingRecord[] = []

  for (const [childIndex, node] of root.children.entries()) {
    if (node.type !== 'heading') {
      continue
    }

    const text = toString(node).trim()
    headings.push({
      node,
      childIndex,
      text,
      normalized: normalizeHeading(text),
    })
  }

  return {root, headings}
}

function validateDocumentTitle(
  document: ParsedDocument,
  source: string,
  path: string,
  diagnostics: SpecDiagnostic[],
): HeadingRecord | null {
  const titles = document.headings.filter(heading => heading.node.depth === 1)

  if (titles.length === 0) {
    diagnostics.push(createDiagnostic('missing-title', 'The spec must include a level-one title.', path))
    return null
  }

  if (titles.length > 1) {
    diagnostics.push(
      createDiagnostic('duplicate-heading', 'The spec must include exactly one level-one title.', path, titles[1]),
    )
  }

  const title = titles[0]
  if (!/^.+ spec$/i.test(title.text)) {
    diagnostics.push(
      createDiagnostic('invalid-title', 'The component spec title must use “{Component} spec”.', path, title),
    )
  }

  const contentBeforeTitle = source.slice(0, title.node.position?.start.offset ?? 0)
  if (!isEmptyMarkdown(contentBeforeTitle)) {
    diagnostics.push(
      createDiagnostic('invalid-title', 'The level-one title must be the first content in the spec.', path, title),
    )
  }

  return title
}

function validateFeatureTitle(
  document: ParsedDocument,
  path: string,
  diagnostics: SpecDiagnostic[],
): HeadingRecord | null {
  const titles = document.headings.filter(heading => heading.node.depth === 1)

  if (titles.length === 0) {
    diagnostics.push(createDiagnostic('missing-title', 'The feature spec must include a level-one title.', path))
    return null
  }

  if (titles.length > 1) {
    diagnostics.push(
      createDiagnostic(
        'duplicate-heading',
        'The feature spec must include exactly one level-one title.',
        path,
        titles[1],
      ),
    )
  }

  return titles[0]
}

function parseComponentName(title: HeadingRecord, path: string, diagnostics: SpecDiagnostic[]): string | null {
  const match = /^(.+?) spec$/i.exec(title.text)
  const name = match?.[1]?.trim()

  if (!name) {
    diagnostics.push(
      createDiagnostic('invalid-title', 'The component spec title must use “{Component} spec”.', path, title),
    )
    return null
  }

  return name
}

function parseFeatures(
  source: string,
  root: Root,
  headings: readonly HeadingRecord[],
  featuresHeading: HeadingRecord,
  path: string,
  diagnostics: SpecDiagnostic[],
): readonly SpecFeature[] {
  const endIndex = findSectionEndIndex(root, featuresHeading)
  const featureHeadings = headings.filter(
    heading =>
      heading.node.depth === 3 && heading.childIndex > featuresHeading.childIndex && heading.childIndex < endIndex,
  )

  if (featureHeadings.length === 0) {
    diagnostics.push(
      createDiagnostic(
        'missing-features',
        'The Features section must include at least one level-three feature.',
        path,
        featuresHeading,
      ),
    )
    return []
  }

  const seen = new Set<string>()
  return featureHeadings.map(featureHeading => {
    if (seen.has(featureHeading.normalized)) {
      diagnostics.push(
        createDiagnostic(
          'duplicate-feature',
          `The feature “${featureHeading.text}” is declared more than once.`,
          path,
          featureHeading,
        ),
      )
    }
    seen.add(featureHeading.normalized)

    const featureEndIndex = findSectionEndIndex(root, featureHeading)
    const sectionHeadings = headings.filter(
      heading =>
        heading.node.depth === 4 &&
        heading.childIndex > featureHeading.childIndex &&
        heading.childIndex < featureEndIndex,
    )
    validateAllowedHeadings(sectionHeadings, featureSectionHeadings, path, diagnostics)

    const description = getIntroMarkdown(source, root, featureHeading)
    if (isEmptyMarkdown(description)) {
      diagnostics.push(
        createDiagnostic(
          'empty-description',
          `The feature “${featureHeading.text}” must include a description.`,
          path,
          featureHeading,
        ),
      )
    }

    if (sectionHeadings.length === 0) {
      diagnostics.push(
        createDiagnostic(
          'unexpected-heading',
          `The feature “${featureHeading.text}” must include at least one supported subsection.`,
          path,
          featureHeading,
        ),
      )
    }

    return {
      name: featureHeading.text,
      description,
      sections: parseFeatureSections(source, root, sectionHeadings, path, diagnostics),
      location: createLocation(path, featureHeading),
      path,
    }
  })
}

function parseFeatureSections(
  source: string,
  root: Root,
  headings: readonly HeadingRecord[],
  path: string,
  diagnostics: SpecDiagnostic[],
): SpecFeatureSections {
  const sections: {
    markup?: SpecSection
    behavior?: SpecSection
    publicApi?: SpecSection
    accessibility?: SpecSection
  } = {}

  for (const heading of headings) {
    const key = featureSectionKey(heading.normalized)
    if (key === null) {
      continue
    }

    if (sections[key] !== undefined) {
      diagnostics.push(
        createDiagnostic(
          'duplicate-heading',
          `The section “${heading.text}” is declared more than once.`,
          path,
          heading,
        ),
      )
      continue
    }

    const section = createSection(source, root, heading, path)
    if (isEmptyMarkdown(section.markdown)) {
      diagnostics.push(
        createDiagnostic('empty-section', `The section “${heading.text}” must not be empty.`, path, heading),
      )
    }
    sections[key] = section
  }

  return sections
}

function parseFeatureLinks(
  root: Root,
  featuresHeading: HeadingRecord,
  path: string,
  diagnostics: SpecDiagnostic[],
): readonly SpecFeatureLink[] {
  const links: SpecFeatureLink[] = []
  const endIndex = findSectionEndIndex(root, featuresHeading)
  const nodes = root.children.slice(featuresHeading.childIndex + 1, endIndex)

  for (const node of nodes) {
    visit(node, 'link', link => {
      links.push(createFeatureLink(link, path))
    })
  }

  if (links.length === 0) {
    diagnostics.push(
      createDiagnostic(
        'missing-features',
        'The Features section must link to at least one feature file.',
        path,
        featuresHeading,
      ),
    )
  }

  const names = new Set<string>()
  const hrefs = new Set<string>()
  for (const link of links) {
    const normalizedName = normalizeHeading(link.name)
    if (names.has(normalizedName) || hrefs.has(link.href)) {
      diagnostics.push({
        code: 'duplicate-feature',
        message: `The feature link “${link.name}” is duplicated.`,
        severity: 'error',
        location: link.location,
      })
    }
    names.add(normalizedName)
    hrefs.add(link.href)
  }

  return links
}

function createFeatureLink(link: Link, path: string): SpecFeatureLink {
  return {
    name: toString(link).trim(),
    href: link.url,
    location: {
      path,
      line: link.position?.start.line ?? 1,
      column: link.position?.start.column ?? 1,
    },
  }
}

function validateDefaultFeature(
  features: readonly SpecFeature[],
  path: string,
  heading: HeadingRecord | null,
  diagnostics: SpecDiagnostic[],
) {
  if (features.length > 0 && normalizeHeading(features[0].name) !== 'default') {
    diagnostics.push(
      createDiagnostic(
        'missing-default-feature',
        'The first feature in a component spec must be named “Default”.',
        path,
        heading,
      ),
    )
  }
}

function validateDefaultFeatureLinks(
  features: readonly SpecFeatureLink[],
  path: string,
  heading: HeadingRecord | null,
  diagnostics: SpecDiagnostic[],
) {
  if (features.length > 0 && normalizeHeading(features[0].name) !== 'default') {
    diagnostics.push(
      createDiagnostic(
        'missing-default-feature',
        'The first feature link in a spec index must be named “Default”.',
        path,
        heading,
      ),
    )
  }
}

function validateForbiddenHeadings(headings: readonly HeadingRecord[], path: string, diagnostics: SpecDiagnostic[]) {
  for (const heading of headings) {
    if (forbiddenHeadings.has(heading.normalized)) {
      diagnostics.push(
        createDiagnostic(
          'forbidden-heading',
          `The section “${heading.text}” does not belong in a component spec.`,
          path,
          heading,
        ),
      )
    }
  }
}

function validateAllowedHeadings(
  headings: readonly HeadingRecord[],
  allowed: ReadonlySet<string>,
  path: string,
  diagnostics: SpecDiagnostic[],
) {
  const seen = new Set<string>()

  for (const heading of headings) {
    if (forbiddenHeadings.has(heading.normalized)) {
      continue
    }

    if (!allowed.has(heading.normalized)) {
      diagnostics.push(
        createDiagnostic(
          'unexpected-heading',
          `The section “${heading.text}” is not supported at this heading level.`,
          path,
          heading,
        ),
      )
      continue
    }

    if (seen.has(heading.normalized)) {
      diagnostics.push(
        createDiagnostic(
          'duplicate-heading',
          `The section “${heading.text}” is declared more than once.`,
          path,
          heading,
        ),
      )
    }
    seen.add(heading.normalized)
  }
}

function findUniqueHeading(
  headings: readonly HeadingRecord[],
  name: string,
  path: string,
  diagnostics: SpecDiagnostic[],
): HeadingRecord | null {
  const matches = headings.filter(heading => heading.normalized === name)
  if (matches.length > 1) {
    diagnostics.push(
      createDiagnostic(
        'duplicate-heading',
        `The section “${matches[1].text}” is declared more than once.`,
        path,
        matches[1],
      ),
    )
  }
  return matches[0] ?? null
}

function createOptionalSection(
  source: string,
  root: Root,
  heading: HeadingRecord | null,
  path: string,
  diagnostics: SpecDiagnostic[],
): SpecSection | undefined {
  if (heading === null) {
    return undefined
  }

  const section = createSection(source, root, heading, path)
  if (isEmptyMarkdown(section.markdown)) {
    diagnostics.push(
      createDiagnostic('empty-section', `The section “${heading.text}” must not be empty.`, path, heading),
    )
  }
  return section
}

function createSection(source: string, root: Root, heading: HeadingRecord, path: string): SpecSection {
  return {
    heading: heading.text,
    markdown: getSectionMarkdown(source, root, heading),
    location: createLocation(path, heading),
  }
}

function getIntroMarkdown(source: string, root: Root, heading: HeadingRecord): string {
  const start = heading.node.position?.end.offset ?? 0
  const nextHeading = root.children
    .slice(heading.childIndex + 1)
    .find((node): node is Heading => node.type === 'heading')
  const end = nextHeading?.position?.start.offset ?? source.length
  return source.slice(start, end).trim()
}

function getSectionMarkdown(source: string, root: Root, heading: HeadingRecord): string {
  const start = heading.node.position?.end.offset ?? 0
  const endIndex = findSectionEndIndex(root, heading)
  const end =
    endIndex < root.children.length ? (root.children[endIndex].position?.start.offset ?? source.length) : source.length
  return source.slice(start, end).trim()
}

function findSectionEndIndex(root: Root, heading: HeadingRecord): number {
  for (let index = heading.childIndex + 1; index < root.children.length; index++) {
    const node = root.children[index]
    if (node.type === 'heading' && node.depth <= heading.node.depth) {
      return index
    }
  }
  return root.children.length
}

function featureSectionKey(heading: string): 'markup' | 'behavior' | 'publicApi' | 'accessibility' | null {
  switch (heading) {
    case 'markup':
      return 'markup'
    case 'behavior':
      return 'behavior'
    case 'public api':
      return 'publicApi'
    case 'accessibility':
      return 'accessibility'
    default:
      return null
  }
}

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function isEmptyMarkdown(value: string): boolean {
  let sanitized = value
  let previous: string
  do {
    previous = sanitized
    sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '')
  } while (sanitized !== previous)
  return sanitized.trim().length === 0
}

function createLocation(path: string, heading: HeadingRecord | null): SpecLocation {
  return {
    path,
    line: heading?.node.position?.start.line ?? 1,
    column: heading?.node.position?.start.column ?? 1,
  }
}

function createDiagnostic(
  code: SpecDiagnosticCode,
  message: string,
  path: string,
  heading: HeadingRecord | null = null,
): SpecDiagnostic {
  return {
    code,
    message,
    severity: 'error',
    location: createLocation(path, heading),
  }
}

function createResult<T>(value: T | null, diagnostics: readonly SpecDiagnostic[]): SpecParseResult<T> {
  return {
    valid: value !== null && diagnostics.every(diagnostic => diagnostic.severity !== 'error'),
    value,
    diagnostics,
  }
}
