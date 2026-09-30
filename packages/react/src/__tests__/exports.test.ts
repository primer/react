import {existsSync} from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import {beforeAll, describe, expect, it} from 'vitest'
// eslint-disable-next-line import/no-namespace
import * as parser from '@babel/parser'
import {traverse} from '@babel/core'
import {createHash} from 'node:crypto'
import {rolldown} from 'rolldown'
import {preserveNamespaceExports} from '../../script/preserve-namespace-exports'

const ROOT_DIR = path.resolve(__dirname, '..', '..')

let project!: Project

beforeAll(async () => {
  project = await setup()
})

describe('@primer/react', () => {
  it('should not update exports without a semver change', async () => {
    const exports = project.getEntrypointExports(path.join(ROOT_DIR, 'src', 'index.ts'))
    expect(
      exports.map(exportInfo => {
        if (exportInfo.type === 'type') {
          return `type ${exportInfo.identifier}`
        }
        return exportInfo.identifier
      }),
    ).toMatchSnapshot()
  })
})

describe('@primer/react/experimental', () => {
  it('should not update exports without a semver change', async () => {
    const exports = project.getEntrypointExports(path.join(ROOT_DIR, 'src', 'experimental', 'index.ts'))
    expect(
      exports.map(exportInfo => {
        if (exportInfo.type === 'type') {
          return `type ${exportInfo.identifier}`
        }
        return exportInfo.identifier
      }),
    ).toMatchSnapshot()
  })
})

describe('@primer/react/deprecated', () => {
  it('should not update exports without a semver change', async () => {
    const exports = project.getEntrypointExports(path.join(ROOT_DIR, 'src', 'deprecated', 'index.ts'))
    expect(
      exports.map(exportInfo => {
        if (exportInfo.type === 'type') {
          return `type ${exportInfo.identifier}`
        }
        return exportInfo.identifier
      }),
    ).toMatchSnapshot()
  })
})

describe('@primer/react/next', () => {
  it('should not update exports without a semver change', async () => {
    const exports = project.getEntrypointExports(path.join(ROOT_DIR, 'src', 'next', 'index.ts'))
    expect(
      exports.map(exportInfo => {
        if (exportInfo.type === 'type') {
          return `type ${exportInfo.identifier}`
        }
        return exportInfo.identifier
      }),
    ).toMatchSnapshot()
  })
})

describe('static compound component exports', () => {
  it('preserves native namespace imports in the published JavaScript', async () => {
    const sources: Record<string, string> = {
      '/src/index.js': "export * as Example from './Example/Example.namespace'",
      '/src/experimental/index.js': "export * as Example from '../Example/Example.namespace'",
      '/src/Example/Example.namespace.js':
        "export {Root, Item} from './Example'; export * as Group from './Group.namespace'",
      '/src/Example/Group.namespace.js': "export {Root} from './Example'",
      '/src/Example/Example.js': 'export function Root() {} export function Item() {}',
    }
    const bundle = await rolldown({
      input: Object.keys(sources),
      plugins: [
        preserveNamespaceExports(),
        {
          name: 'namespace-export-fixture',
          resolveId(source, importer) {
            const id = importer ? path.posix.resolve(path.posix.dirname(importer), source) : source
            if (id in sources) {
              return id
            }
            if (`${id}.js` in sources) {
              return `${id}.js`
            }
            return null
          },
          load(id) {
            return sources[id] ?? null
          },
        },
      ],
    })

    try {
      const {output} = await bundle.generate({
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: '/src',
      })
      const namespaceImports: Array<string> = []

      for (const chunk of output) {
        if (chunk.type !== 'chunk') {
          continue
        }
        expect(chunk.code).not.toContain('__exportAll')
        const ast = parser.parse(chunk.code, {sourceType: 'module'})
        for (const statement of ast.program.body) {
          if (
            statement.type === 'ImportDeclaration' &&
            statement.specifiers.some(specifier => {
              return specifier.type === 'ImportNamespaceSpecifier'
            })
          ) {
            const target = path.posix.normalize(
              path.posix.join(path.posix.dirname(chunk.fileName), statement.source.value),
            )
            expect(
              output.some(file => {
                return file.fileName === target
              }),
            ).toBe(true)
            namespaceImports.push(`${chunk.fileName}: ${statement.source.value}`)
          }
        }
      }

      expect(namespaceImports.sort()).toEqual([
        'Example/Example.namespace.js: ./Group.namespace.js',
        'experimental/index.js: ../Example/Example.namespace.js',
        'index.js: ./Example/Example.namespace.js',
      ])
    } finally {
      await bundle.close()
    }
  })

  it.each(['index.ts', 'experimental/index.ts'])('%s re-exports namespace members directly', async entrypoint => {
    const filepath = path.join(ROOT_DIR, 'src', entrypoint)
    const ast = parser.parse(await fs.readFile(filepath, 'utf8'), {
      sourceType: 'module',
      plugins: ['typescript'],
    })
    const members: Array<string> = []

    for (const statement of ast.program.body) {
      if (statement.type !== 'ExportNamedDeclaration' || !statement.source) {
        continue
      }

      for (const specifier of statement.specifiers) {
        if (specifier.type !== 'ExportNamespaceSpecifier') {
          continue
        }

        const resolved = resolve(statement.source.value, filepath)
        if (resolved.type !== 'relative') {
          throw new Error(`Expected a local namespace module: ${statement.source.value}`)
        }

        members.push(...(await getNamespaceMembers(resolved.value, specifier.exported.name)))
      }
    }

    expect(members.length).toBeGreaterThan(0)
    expect(members.sort()).toMatchSnapshot()
  })
})

async function getNamespaceMembers(filepath: string, name: string): Promise<Array<string>> {
  const ast = parser.parse(await fs.readFile(filepath, 'utf8'), {
    sourceType: 'module',
    plugins: ['typescript'],
  })
  const members: Array<string> = []

  for (const statement of ast.program.body) {
    if (statement.type !== 'ExportNamedDeclaration' || !statement.source || statement.declaration) {
      throw new Error(`Namespace ${name} must contain only direct re-exports`)
    }

    for (const specifier of statement.specifiers) {
      if (specifier.exported.type !== 'Identifier') {
        throw new Error(`Namespace ${name} must use identifier exports`)
      }

      const member = `${name}.${specifier.exported.name}`
      if (specifier.type === 'ExportNamespaceSpecifier') {
        const resolved = resolve(statement.source.value, filepath)
        if (resolved.type !== 'relative') {
          throw new Error(`Expected a local namespace module: ${statement.source.value}`)
        }
        members.push(...(await getNamespaceMembers(resolved.value, member)))
      } else {
        expect(specifier.type).toBe('ExportSpecifier')
        members.push(member)
      }
    }
  }

  expect(members).toContain(`${name}.Root`)
  expect(members).not.toContain(`${name}.default`)
  return members
}

interface Project {
  getEntrypointExports(filepath: string): Array<EntrypointExport>
}

type EntrypointExport = {
  identifier: string
  type: 'value' | 'type'
}

type ExportAllDeclaration = {
  type: 'ExportAllDeclaration'
  source: string
}

type ExportDefaultDeclaration = {
  type: 'ExportDefaultDeclaration'
  declaration: string
  source?: string
}

type ExportSpecifier = {
  type: 'ExportSpecifier'
  local: string
  exported: string
  exportKind?: 'value' | 'type' | null
  source?: string
  declaration?: string
}

type ExportInfo = ExportAllDeclaration | ExportDefaultDeclaration | ExportSpecifier

type Export = {
  identifier: string
  type: string | null
  source: string | null
  exportKind: 'value' | 'type'
}

interface SourceModule {
  type: 'source'
  id: string
  filepath: string
  addSource(source: string): ReturnType<typeof resolve> | null
  getSourceModuleId(source: string): string
  addDependency(dependencyId: string): void
  addExport(exportInfo: ExportInfo): void
  getExports(): Array<Export>
}

interface BareModule {
  type: 'bare'
  id: string
  specifier: string
}

async function setup(): Promise<Project> {
  const graph = new Map<string, SourceModule | BareModule>()
  const queue = [
    // main
    path.join(ROOT_DIR, 'src', 'index.ts'),

    // deprecated
    path.join(ROOT_DIR, 'src', 'deprecated', 'index.ts'),

    // experimental
    path.join(ROOT_DIR, 'src', 'experimental', 'index.ts'),

    // next
    path.join(ROOT_DIR, 'src', 'next', 'index.ts'),
  ]
  const BareModule = {
    create(specifier: string): BareModule {
      return {
        type: 'bare',
        id: BareModule.getModuleId(specifier),
        specifier,
      }
    },
    getModuleId(specifier: string) {
      return hash(specifier)
    },
  }
  const SourceModule = {
    create(filepath: string) {
      const dependencies = new Set()
      const sources = new Map()
      const exportsInfo: Array<ExportInfo> = []
      const mod: SourceModule = {
        type: 'source',
        id: SourceModule.getModuleId(filepath),
        filepath,
        addSource(source: string) {
          if (sources.has(source)) {
            return null
          }

          const extension = path.extname(source)
          const resolved = resolve(source, mod.filepath)
          if (
            extension !== '' &&
            !extensions.includes(extension) &&
            (resolved.type !== 'relative' || !extensions.includes(path.extname(resolved.value)))
          ) {
            return null
          }

          if (resolved.type === 'error') {
            // eslint-disable-next-line no-console
            console.log('Unable to resolve source')
            // eslint-disable-next-line no-console
            console.log(resolved.error)
            return null
          }

          if (resolved.type === 'relative') {
            queue.push(resolved.value)
            const id = SourceModule.getModuleId(resolved.value)
            mod.addDependency(id)
            sources.set(source, id)
          }

          if (resolved.type === 'bare') {
            const id = BareModule.getModuleId(resolved.path)
            if (!graph.has(id)) {
              graph.set(id, BareModule.create(resolved.path))
            }
            mod.addDependency(id)
            sources.set(source, id)
          }

          if (resolved.type === 'absolute') {
            throw new Error('Unimplemented')
          }

          return resolved
        },
        getSourceModuleId(source: string) {
          if (sources.has(source)) {
            return sources.get(source)
          }
          throw new Error(`Unable to find source: ${source}`)
        },
        addDependency(dependencyId: string) {
          dependencies.add(dependencyId)
        },
        addExport(exportInfo: ExportInfo) {
          const info = {
            ...exportInfo,
          }

          if (exportInfo.source) {
            info.source = mod.getSourceModuleId(exportInfo.source)
          }

          exportsInfo.push(info)
        },
        getExports() {
          return exportsInfo.flatMap(exportInfo => {
            if (exportInfo.type === 'ExportSpecifier') {
              return {
                identifier: exportInfo.exported,
                type: exportInfo.declaration ?? null,
                source: exportInfo.source ?? null,
                exportKind: exportInfo.exportKind ?? 'value',
              }
            }

            if (exportInfo.type === 'ExportDefaultDeclaration') {
              return {
                identifier: 'default',
                type: exportInfo.declaration,
                source: exportInfo.source ?? null,
                exportKind: 'exportKind' in exportInfo ? (exportInfo.exportKind as 'type' | 'value') : 'value',
              }
            }

            // This branch matches exportInfo.type === 'ExportAllDeclaration'
            const sourceModule = graph.get(exportInfo.source)
            if (!sourceModule) {
              return []
            }

            if (sourceModule.type === 'bare') {
              return []
            }

            return sourceModule.getExports().map(exportInfo => {
              return {
                ...exportInfo,
                source: exportInfo.source,
              }
            })
          })
        },
      }

      return mod
    },
    getModuleId(filepath: string) {
      return hash(filepath)
    },
  }

  while (queue.length !== 0) {
    const filepath = queue.shift()
    if (!filepath) {
      continue
    }

    const id = SourceModule.getModuleId(filepath)
    if (graph.has(id)) {
      continue
    }

    const mod = SourceModule.create(filepath)
    const contents = await fs.readFile(filepath, 'utf8')
    const ast = parser.parse(contents, {
      sourceType: 'module',
      plugins: [
        'typescript',
        // Language
        'jsx',
        // Proposal
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'decorators-legacy',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'importMeta',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'topLevelAwait',
      ],
    })

    const sources: Array<string> = []

    traverse(ast, {
      ImportDeclaration(path) {
        sources.push(path.node.source.value)
      },

      ExportDefaultDeclaration(path) {
        // @ts-ignore this should exist on the type
        if (path.node.source) {
          // @ts-ignore this should exist on the type
          sources.push(path.node.source.value)
        }
      },

      ExportNamedDeclaration(path) {
        if (path.node.source) {
          sources.push(path.node.source.value)
        }
      },

      ExportAllDeclaration(path) {
        sources.push(path.node.source.value)
      },
    })

    for (const source of sources) {
      const resolved = mod.addSource(source)
      if (resolved === null) {
        continue
      }

      if (resolved.type === 'relative') {
        queue.push(resolved.value)
      }
    }

    graph.set(mod.id, mod)
  }

  for (const mod of graph.values()) {
    if (mod.type !== 'source') {
      continue
    }

    const contents = await fs.readFile(mod.filepath, 'utf8')
    const ast = parser.parse(contents, {
      sourceType: 'module',
      plugins: [
        'typescript',
        // Language
        'jsx',
        // Proposal
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'decorators-legacy',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'importMeta',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'topLevelAwait',
      ],
    })

    const exports: Array<ExportInfo> = []

    traverse(ast, {
      ExportAllDeclaration(path) {
        exports.push({
          type: 'ExportAllDeclaration',
          source: path.node.source.value,
        })
      },

      ExportDefaultDeclaration(path) {
        exports.push({
          type: 'ExportDefaultDeclaration',
          declaration: path.node.declaration.type,
          // @ts-ignore this value may exist when using:
          // export default from 'mod'
          source: path.node.source?.value,
        })
      },

      ExportNamedDeclaration(path) {
        for (const specifier of path.node.specifiers) {
          const source = path.node.source?.value

          if (specifier.type === 'ExportNamespaceSpecifier') {
            exports.push({
              type: 'ExportSpecifier',
              local: '*',
              exported: specifier.exported.name,
              exportKind: path.node.exportKind,
              source,
            })
            continue
          }

          exports.push({
            type: 'ExportSpecifier',
            // @ts-ignore this is available due to type narrowing
            local: specifier.local.name,
            // @ts-ignore this is available due to type narrowing
            exported: specifier.exported.name,
            exportKind: path.node.exportKind,
            source,
          })
        }

        if (path.node.declaration) {
          if (path.node.declaration.type === 'VariableDeclaration') {
            for (const declarator of path.node.declaration.declarations) {
              exports.push({
                type: 'ExportSpecifier',
                // @ts-ignore this value should exist due to type narrowing
                local: declarator.id.name,
                // @ts-ignore this value should exist due to type narrowing
                exported: declarator.id.name,
                exportKind: path.node.exportKind,
                declaration: path.node.declaration.type,
              })
            }
          }

          // @ts-ignore this value should exist due to type narrowing
          if (path.node.declaration.id) {
            // @ts-ignore this value should exist due to type narrowing
            const exported = path.node.declaration.id.name

            exports.push({
              type: 'ExportSpecifier',
              exported,
              local: exported,
              exportKind: path.node.exportKind,
              declaration: path.node.declaration.type,
            })
          }
        }
      },
    })

    for (const exportInfo of exports) {
      mod.addExport(exportInfo)
    }
  }

  return {
    getEntrypointExports(filepath: string): Array<EntrypointExport> {
      const id = SourceModule.getModuleId(filepath)
      if (graph.has(id)) {
        const mod = graph.get(id)
        if (mod?.type === 'source') {
          const moduleExports = mod.getExports()
          return moduleExports
            .map(exportInfo => {
              return {
                identifier: exportInfo.identifier,
                type: exportInfo.exportKind,
              }
            })
            .sort((a, b) => {
              if (a.identifier === b.identifier) {
                if (a.type === 'value') {
                  return -1
                }

                if (b.type === 'value') {
                  return 1
                }
              }
              return a.identifier.localeCompare(b.identifier)
            })
        }
      }

      throw new Error(`Unable to find entrypoint with filepath: ${filepath}`)
    },
  }
}

const extensions = ['.tsx', '.ts', '.js', '.jsx', '.mjs', '.cjs']

// Terminology: https://nodejs.org/api/esm.html#terminology

/**
 * Represents an error when resolving the given import or export source
 */
type ResolveError = {
  type: 'error'
  error: Error
}

/**
 * import mod from './some/local/file';
 */
type ResolveRelativeModule = {
  type: 'relative'
  value: string
}

/**
 * import mod from 'mod';
 */
type ResolveBareModule = {
  type: 'bare'
  value: string
  path: string
}

/**
 * import mod from '/mod';
 */
type ResolveAbsoluteModule = {
  type: 'absolute'
  value: string
}

/**
 * Resolve the given import or export source. If the source is a filepath, it
 * will attempt to resolve the module relative to the given filepath.
 */
function resolve(
  source: string,
  filepath: string,
): ResolveBareModule | ResolveRelativeModule | ResolveAbsoluteModule | ResolveError {
  if (source.startsWith('.')) {
    const directory = path.dirname(filepath)
    const extension = path.extname(source)
    if (extension === '' || !extensions.includes(extension)) {
      const candidate = extensions
        .flatMap(extension => {
          return [
            path.resolve(
              directory,
              path.format({
                name: source,
                ext: extension,
              }),
            ),
            path.resolve(
              directory,
              path.format({
                dir: source,
                name: 'index',
                ext: extension,
              }),
            ),
          ]
        })
        .find(candidate => {
          return existsSync(candidate)
        })
      if (candidate) {
        return {
          type: 'relative',
          value: candidate,
        }
      }

      return {
        type: 'error',
        error: new Error(`Unable to find file: ${source} from: ${filepath}`),
      }
    }

    const resolvedPath = path.resolve(directory, source)
    if (!existsSync(resolvedPath)) {
      return {
        type: 'error',
        error: new Error(`Unable to find file: ${source} from: ${filepath}`),
      }
    }
    return {
      type: 'relative',
      value: resolvedPath,
    }
  }

  if (source.startsWith('/')) {
    return {
      type: 'absolute',
      value: source,
    }
  }

  if (source.startsWith('@')) {
    const [scope, name] = source.split('/')
    return {
      type: 'bare',
      value: `${scope}/${name}`,
      path: source,
    }
  }

  const [name] = source.split('/')

  return {
    type: 'bare',
    value: name,
    path: source,
  }
}

function hash(data: string): string {
  return createHash('sha1').update(data).digest('base64url')
}
