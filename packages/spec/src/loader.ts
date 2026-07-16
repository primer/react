import {readdir, readFile, stat} from 'node:fs/promises'
import path from 'node:path'
import {createSplitComponentSpec, parseComponentSpec, parseFeatureSpec, parseSpecIndex} from './parser'
import type {FindComponentSpecsOptions, SpecCollectionResult, SpecDiagnostic, SpecParseResult} from './types'

const defaultIgnoredDirectories = new Set(['.agents', '.git', 'dist', 'node_modules'])

export async function loadComponentSpec(inputPath: string): Promise<SpecParseResult> {
  const resolvedInput = path.resolve(inputPath)
  const entry = await resolveSpecEntry(resolvedInput)

  if (!entry.valid) {
    return {
      valid: false,
      value: null,
      diagnostics: entry.diagnostics,
    }
  }

  if (entry.format === 'single') {
    const source = await readMarkdown(entry.path)
    if (!source.valid || source.value === null) {
      return {
        valid: false,
        value: null,
        diagnostics: source.diagnostics,
      }
    }
    return parseComponentSpec(source.value, entry.path)
  }

  return loadSplitComponentSpec(entry.path)
}

export async function findComponentSpecs(
  rootPath: string,
  options: FindComponentSpecsOptions = {},
): Promise<readonly string[]> {
  const root = path.resolve(rootPath)
  const ignored = new Set([...defaultIgnoredDirectories, ...(options.ignore ?? [])])
  const entries: string[] = []

  await visitDirectory(root, ignored, entries)
  return entries.sort()
}

export async function validateComponentSpecs(
  rootPath: string,
  options: FindComponentSpecsOptions = {},
): Promise<SpecCollectionResult> {
  const entries = await findComponentSpecs(rootPath, options)
  const results = await Promise.all(entries.map(entry => loadComponentSpec(entry)))
  const specs = results.flatMap(result => (result.value === null ? [] : [result.value]))
  const diagnostics = results.flatMap(result => result.diagnostics)

  return {
    valid: results.every(result => result.valid),
    specs,
    diagnostics,
  }
}

async function loadSplitComponentSpec(indexPath: string): Promise<SpecParseResult> {
  const indexSource = await readMarkdown(indexPath)
  if (!indexSource.valid || indexSource.value === null) {
    return {
      valid: false,
      value: null,
      diagnostics: indexSource.diagnostics,
    }
  }

  const indexResult = parseSpecIndex(indexSource.value, indexPath)
  const diagnostics: SpecDiagnostic[] = [...indexResult.diagnostics]
  if (indexResult.value === null) {
    return {
      valid: false,
      value: null,
      diagnostics,
    }
  }

  const indexDirectory = path.dirname(indexPath)
  const features = []
  const featurePaths: string[] = []

  for (const link of indexResult.value.features) {
    const resolvedLink = resolveFeatureLink(indexDirectory, link.href)
    if (resolvedLink === null) {
      diagnostics.push({
        code: 'invalid-feature-link',
        message: `The feature link “${link.href}” must reference a Markdown file in the spec directory.`,
        severity: 'error',
        location: link.location,
      })
      continue
    }

    const featureSource = await readMarkdown(resolvedLink)
    if (!featureSource.valid || featureSource.value === null) {
      diagnostics.push({
        code: 'missing-feature-file',
        message: `The feature file “${link.href}” could not be read.`,
        severity: 'error',
        location: link.location,
      })
      continue
    }

    const featureResult = parseFeatureSpec(featureSource.value, resolvedLink)
    diagnostics.push(...featureResult.diagnostics)
    featurePaths.push(resolvedLink)

    if (featureResult.value === null) {
      continue
    }

    if (normalizeName(featureResult.value.name) !== normalizeName(link.name)) {
      diagnostics.push({
        code: 'feature-title-mismatch',
        message: `The feature link “${link.name}” does not match the title “${featureResult.value.name}”.`,
        severity: 'error',
        location: link.location,
      })
    }

    features.push(featureResult.value)
  }

  diagnostics.push(...(await findOrphanFeatureFiles(indexDirectory, featurePaths)))

  const spec = createSplitComponentSpec(indexResult.value, features, [indexPath, ...featurePaths])
  return {
    valid: diagnostics.every(diagnostic => diagnostic.severity !== 'error'),
    value: spec,
    diagnostics,
  }
}

async function resolveSpecEntry(inputPath: string): Promise<
  | {
      readonly valid: true
      readonly path: string
      readonly format: 'single' | 'split'
      readonly diagnostics: readonly SpecDiagnostic[]
    }
  | {
      readonly valid: false
      readonly path: null
      readonly format: null
      readonly diagnostics: readonly SpecDiagnostic[]
    }
> {
  const inputStat = await getStat(inputPath)
  if (inputStat === null) {
    return invalidEntry('file-not-found', `No file or directory exists at “${inputPath}”.`, inputPath)
  }

  if (inputStat.isFile()) {
    if (path.basename(inputPath) === 'SPEC.md') {
      return {valid: true, path: inputPath, format: 'single', diagnostics: []}
    }
    if (path.basename(inputPath) === 'README.md' && path.basename(path.dirname(inputPath)) === 'spec') {
      return {valid: true, path: inputPath, format: 'split', diagnostics: []}
    }
    return invalidEntry('invalid-entry', 'A component spec entry must be SPEC.md or spec/README.md.', inputPath)
  }

  const directIndex =
    path.basename(inputPath) === 'spec' ? path.join(inputPath, 'README.md') : path.join(inputPath, 'SPEC.md')
  const splitIndex = path.basename(inputPath) === 'spec' ? directIndex : path.join(inputPath, 'spec', 'README.md')
  const [hasDirectIndex, hasSplitIndex] = await Promise.all([isFile(directIndex), isFile(splitIndex)])

  if (path.basename(inputPath) !== 'spec' && hasDirectIndex && hasSplitIndex) {
    return invalidEntry(
      'ambiguous-spec',
      'The component directory contains both SPEC.md and spec/README.md.',
      inputPath,
    )
  }

  if (hasDirectIndex) {
    return {
      valid: true,
      path: directIndex,
      format: path.basename(inputPath) === 'spec' ? 'split' : 'single',
      diagnostics: [],
    }
  }

  if (hasSplitIndex) {
    return {valid: true, path: splitIndex, format: 'split', diagnostics: []}
  }

  return invalidEntry(
    'file-not-found',
    'The component directory does not contain SPEC.md or spec/README.md.',
    inputPath,
  )
}

async function visitDirectory(directory: string, ignored: ReadonlySet<string>, entries: string[]) {
  const children = await readdir(directory, {withFileTypes: true})
  const hasSingleSpec = children.some(child => child.isFile() && child.name === 'SPEC.md')
  const hasSplitSpec = await isFile(path.join(directory, 'spec', 'README.md'))

  if (hasSingleSpec || hasSplitSpec) {
    entries.push(directory)
  }

  await Promise.all(
    children
      .filter(child => child.isDirectory() && child.name !== 'spec' && !ignored.has(child.name))
      .map(child => visitDirectory(path.join(directory, child.name), ignored, entries)),
  )
}

async function findOrphanFeatureFiles(
  directory: string,
  linkedFeaturePaths: readonly string[],
): Promise<readonly SpecDiagnostic[]> {
  const linked = new Set(linkedFeaturePaths.map(featurePath => path.resolve(featurePath)))
  const children = await readdir(directory, {withFileTypes: true})

  return children
    .filter(child => child.isFile() && child.name.endsWith('.md') && child.name !== 'README.md')
    .map(child => path.resolve(directory, child.name))
    .filter(featurePath => !linked.has(featurePath))
    .map(featurePath => ({
      code: 'orphan-feature-file' as const,
      message: `The feature file “${path.basename(featurePath)}” is not linked from the spec index.`,
      severity: 'error' as const,
      location: {
        path: featurePath,
        line: 1,
        column: 1,
      },
    }))
}

function resolveFeatureLink(directory: string, href: string): string | null {
  const [pathname] = href.split('#')
  if (!pathname || path.isAbsolute(pathname) || /^[a-z][a-z\d+.-]*:/i.test(pathname)) {
    return null
  }

  const resolved = path.resolve(directory, pathname)
  const relative = path.relative(directory, resolved)
  if (
    relative.startsWith('..') ||
    path.isAbsolute(relative) ||
    path.dirname(relative) !== '.' ||
    path.extname(resolved) !== '.md'
  ) {
    return null
  }

  return resolved
}

async function readMarkdown(filePath: string): Promise<SpecParseResult<string>> {
  try {
    return {
      valid: true,
      value: await readFile(filePath, 'utf8'),
      diagnostics: [],
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      valid: false,
      value: null,
      diagnostics: [
        {
          code: 'read-failed',
          message: `Unable to read “${filePath}”: ${message}`,
          severity: 'error',
          location: {
            path: filePath,
            line: 1,
            column: 1,
          },
        },
      ],
    }
  }
}

async function getStat(filePath: string) {
  try {
    return await stat(filePath)
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return null
    }
    throw error
  }
}

async function isFile(filePath: string): Promise<boolean> {
  return (await getStat(filePath))?.isFile() ?? false
}

function invalidEntry(code: 'ambiguous-spec' | 'file-not-found' | 'invalid-entry', message: string, inputPath: string) {
  return {
    valid: false as const,
    path: null,
    format: null,
    diagnostics: [
      {
        code,
        message,
        severity: 'error' as const,
        location: {
          path: inputPath,
          line: 1,
          column: 1,
        },
      },
    ],
  }
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}
