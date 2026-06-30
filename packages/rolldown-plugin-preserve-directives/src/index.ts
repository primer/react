import {
  RolldownMagicString as MagicString,
  type Plugin,
  type PluginContext,
  type RenderedChunk,
  type TransformPluginContext,
} from 'rolldown'

type Program = ReturnType<TransformPluginContext['parse']>

export interface PreserveDirectivesOptions {
  readonly directives?: readonly string[]
}

const DEFAULT_DIRECTIVES = ['use client']
const metaKey = 'preserve-directives'

export function preserveDirectives(options: PreserveDirectivesOptions = {}): Plugin {
  const directives = options.directives ?? DEFAULT_DIRECTIVES

  return {
    name: 'preserve-directives',
    transform(code, id) {
      if (isDeclarationFile(id)) {
        return null
      }

      const ast = this.parse(code)
      const sourceDirectives = getDirectives(ast, directives)

      if (sourceDirectives.length > 0) {
        return {
          code,
          ast,
          map: null,
          meta: {
            [metaKey]: sourceDirectives,
          },
        }
      }

      return {
        code,
        ast,
        map: null,
      }
    },
    renderChunk: {
      order: 'post',
      handler(code, chunk, options) {
        if (!options.preserveModules) {
          return undefined
        }

        if (isDeclarationFile(chunk.fileName)) {
          return null
        }

        const chunkDirectives = getChunkDirectives(this, chunk)

        if (chunkDirectives.length === 0) {
          return null
        }

        const ast = this.parse(code)
        const existingDirectives = new Set(getDirectives(ast, directives))
        const missingDirectives = chunkDirectives.filter(directive => !existingDirectives.has(directive))

        if (missingDirectives.length === 0) {
          return null
        }

        const transformed = new MagicString(code)
        transformed.prepend(`${missingDirectives.map(directive => JSON.stringify(directive)).join(';\n')};\n`)

        return {
          code: transformed.toString(),
          map: null,
        }
      },
    },
  }
}

function isDeclarationFile(id: string) {
  return /\.d\.[cm]?ts(?:$|\?)/.test(id)
}

function getDirectives(ast: Program, directives: readonly string[]) {
  const directiveSet = new Set(directives)
  const sourceDirectives: Array<string> = []

  for (const node of ast.body) {
    if (node.type !== 'ExpressionStatement') {
      continue
    }

    if (node.directive && directiveSet.has(node.directive)) {
      sourceDirectives.push(node.directive)
    }
  }

  return sourceDirectives
}

function getChunkDirectives(context: PluginContext, chunk: RenderedChunk) {
  const chunkDirectives = new Set<string>()

  for (const moduleId of Object.keys(chunk.modules)) {
    const moduleInfo = context.getModuleInfo(moduleId)
    if (moduleInfo === null) {
      continue
    }

    const moduleDirectives = moduleInfo.meta[metaKey]

    if (Array.isArray(moduleDirectives)) {
      for (const directive of moduleDirectives) {
        if (typeof directive === 'string') {
          chunkDirectives.add(directive)
        }
      }
    }
  }

  return Array.from(chunkDirectives)
}
