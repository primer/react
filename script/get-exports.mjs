import {existsSync} from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import * as parser from '@babel/parser'
import {traverse} from '@babel/core'

async function main() {
  const graph = new Map()
  const queue = [
    // main
    path.join(process.cwd(), 'src', 'index.ts'),

    // deprecated
    path.join(process.cwd(), 'src', 'deprecated', 'index.ts'),

    // experimental
    path.join(process.cwd(), 'src', 'experimental', 'index.ts'),
  ]
  const BareModule = {
    create(specifier) {
      return {
        type: 'bare',
        id: BareModule.getModuleId(specifier),
        specifier,
      }
    },
    getModuleId(specifier) {
      return hash(specifier)
    },
  }
  const SourceModule = {
    create(filepath) {
      const dependencies = new Set()
      const sources = new Map()
      const exportsInfo = []
      const mod = {
        type: 'source',
        id: SourceModule.getModuleId(filepath),
        filepath,
        addSource(source) {
          if (sources.has(source)) {
            return null
          }

          const extension = path.extname(source)
          if (extension !== '' && extensions.includes(extension)) {
            return null
          }

          const resolved = resolve(source, mod.filepath)
          if (resolved.error) {
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
        getSourceModuleId(source) {
          if (sources.has(source)) {
            return sources.get(source)
          }
          throw new Error(`Unable to find source: ${source}`)
        },
        addDependency(dependencyId) {
          dependencies.add(dependencyId)
        },
        addExport(exportInfo) {
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
                exportKind: exportInfo.exportKind,
              }
            }

            if (exportInfo.type === 'ExportAllDeclaration') {
              const sourceModule = graph.get(exportInfo.source)
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
    getModuleId(filepath) {
      return hash(filepath)
    },
  }

  while (queue.length !== 0) {
    const filepath = queue.shift()
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

    const sources = []

    traverse(ast, {
      ImportDeclaration(path) {
        sources.push(path.node.source.value)
      },

      ExportDefaultDeclaration(path) {
        if (path.node.source) {
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
      if (resolved?.type === 'relative') {
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

    const exports = []

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
          source: path.node.source?.value,
        })
      },

      ExportNamedDeclaration(path) {
        for (const specifier of path.node.specifiers) {
          const source = path.node.source?.value

          exports.push({
            type: 'ExportSpecifier',
            local: specifier.local.name,
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
                local: declarator.id.name,
                exported: declarator.id.name,
                exportKind: path.node.exportKind,
                declaration: path.node.declaration.type,
              })
            }
          }

          if (path.node.declaration.id) {
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

  function getModuleExports(filepath) {
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

main().catch(error => {
  console.log(error)
  process.exit(1)
})

const extensions = ['.tsx', '.ts', '.js', '.jsx', '.mjs', '.cjs']

// Terminology: https://nodejs.org/api/esm.html#terminology
function resolve(source, filepath) {
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

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
function hash(key, seed) {
  var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i

  remainder = key.length & 3 // key.length % 4
  bytes = key.length - remainder
  h1 = seed
  c1 = 0xcc9e2d51
  c2 = 0x1b873593
  i = 0

  while (i < bytes) {
    k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24)
    ++i

    k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff
    k1 = (k1 << 15) | (k1 >>> 17)
    k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff

    h1 ^= k1
    h1 = (h1 << 13) | (h1 >>> 19)
    h1b = ((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff
    h1 = (h1b & 0xffff) + 0x6b64 + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16)
  }

  k1 = 0

  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16
    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8
    case 1:
      k1 ^= key.charCodeAt(i) & 0xff

      k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff
      k1 = (k1 << 15) | (k1 >>> 17)
      k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff
      h1 ^= k1
  }

  h1 ^= key.length

  h1 ^= h1 >>> 16
  h1 = ((h1 & 0xffff) * 0x85ebca6b + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff
  h1 ^= h1 >>> 13
  h1 = ((h1 & 0xffff) * 0xc2b2ae35 + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) & 0xffffffff
  h1 ^= h1 >>> 16

  return h1 >>> 0
}
