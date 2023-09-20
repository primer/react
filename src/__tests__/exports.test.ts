import {existsSync} from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import * as parser from '@babel/parser'
import {traverse} from '@babel/core'
import {createHash} from 'node:crypto'

const ROOT_DIR = path.resolve(__dirname, '..', '..')

describe('@primer/react', () => {
  it('should not update exports without a semver change', async () => {
    const project = await getProject()
    const moduleExports = project
      .getModuleExports(path.join(ROOT_DIR, 'src', 'index.ts'))
      .sort((a, b) => {
        return a.identifier.localeCompare(b.identifier)
      })
      .map(exportInfo => {
        if (exportInfo.exportKind === 'type') {
          return `type ${exportInfo.identifier}`
        }
        return exportInfo.identifier
      })
    expect(moduleExports).toMatchSnapshot()
  })
})

describe('@primer/react/experimental', () => {
  it('should not update exports without a semver change', async () => {
    const project = await getProject()
    const moduleExports = project
      .getModuleExports(path.join(ROOT_DIR, 'src', 'experimental', 'index.ts'))
      .sort((a, b) => {
        return a.identifier.localeCompare(b.identifier)
      })
      .map(exportInfo => {
        if (exportInfo.exportKind === 'type') {
          return `type ${exportInfo.identifier}`
        }
        return exportInfo.identifier
      })
    expect(moduleExports).toMatchSnapshot()
  })
})

describe('@primer/react/decprecated', () => {
  it('should not update exports without a semver change', async () => {
    const project = await getProject()
    const moduleExports = project
      .getModuleExports(path.join(ROOT_DIR, 'src', 'deprecated', 'index.ts'))
      .sort((a, b) => {
        return a.identifier.localeCompare(b.identifier)
      })
      .map(exportInfo => {
        if (exportInfo.exportKind === 'type') {
          return `type ${exportInfo.identifier}`
        }
        return exportInfo.identifier
      })
    expect(moduleExports).toMatchSnapshot()
  })
})

interface Project {
  getModuleExports(
    filepath: string,
  ): Array<{identifier: string; type?: string; source?: string; exportKind?: string | null}>
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

interface SourceModule {
  type: 'source'
  id: string
  filepath: string
  addSource(source: string): ReturnType<typeof resolve> | null
  getSourceModuleId(source: string): string
  addDependency(dependencyId: string): void
  addExport(exportInfo: ExportInfo): void
  getExports(): Array<{identifier: string; type?: string; source?: string; exportKind?: string | null}>
}

interface BareModule {
  type: 'bare'
  id: string
  specifier: string
}

let project: Project | null = null

async function getProject(): Promise<Project> {
  if (!project) {
    project = await setup()
  }
  return project
}

async function setup() {
  const graph = new Map<string, SourceModule | BareModule>()
  const queue = [
    // main
    path.join(ROOT_DIR, 'src', 'index.ts'),

    // deprecated
    path.join(process.cwd(), 'src', 'deprecated', 'index.ts'),

    // experimental
    path.join(process.cwd(), 'src', 'experimental', 'index.ts'),
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
          if (extension !== '' && extensions.includes(extension)) {
            return null
          }

          const resolved = resolve(source, mod.filepath)
          if (resolved.type === 'error') {
            console.log('Unable to resolve source')
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
          exportsInfo.push({
            ...exportInfo,
            source: exportInfo.source ? mod.getSourceModuleId(exportInfo.source) : null,
          })
        },
        getExports() {
          return exportsInfo.flatMap(exportInfo => {
            if (exportInfo.type === 'ExportSpecifier') {
              return {
                identifier: exportInfo.exported,
                type: exportInfo.declaration,
                source: exportInfo.source,
                exportKind: exportInfo.exportKind,
              }
            }

            if (exportInfo.type === 'ExportDefaultDeclaration') {
              return {
                identifier: 'default',
                type: exportInfo.declaration,
                source: exportInfo.source,
                exportKind: 'exportKind' in exportInfo ? (exportInfo.exportKind as 'type' | 'value') : null,
              }
            }

            if (exportInfo.type === 'ExportAllDeclaration') {
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
            }

            throw new Error('unimplemented')
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
                // @ts-ignore
                local: declarator.id.name,
                // @ts-ignore
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

  function getModuleExports(filepath: string) {
    const id = SourceModule.getModuleId(filepath)
    if (graph.has(id)) {
      return graph.get(id).getExports()
    }
    throw new Error(`Unable to find module for: ${filepath}`)
  }

  return {
    getModuleExports,
  }
}

const extensions = ['.tsx', '.ts', '.js', '.jsx', '.mjs', '.cjs']

// Terminology: https://nodejs.org/api/esm.html#terminology

type ResolveError = {
  type: 'error'
  error: Error
}

type ResolveRelativeModule = {
  type: 'relative'
  value: string
}

type ResolveBareModule = {
  type: 'bare'
  value: string
  path: string
}

type ResolveAbsoluteModule = {
  type: 'absolute'
  value: string
}

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
        error: new Error(`Unable to find file: ${source} from: ${filepath}`),
      }
    }

    const resolvedPath = path.resolve(directory, source)
    if (!existsSync(resolvedPath)) {
      return {
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
