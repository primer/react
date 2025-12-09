import type {Plugin} from 'rollup'
import fs from 'node:fs/promises'
import path from 'node:path'
import {createHash} from 'node:crypto'
import postcss from 'postcss'
import postcssModules from 'postcss-modules'

interface ImportCSSOptions {
  /**
   * Provide the root directory for your package. This is used to calculate the
   * relative path for generated CSS files
   */
  modulesRoot: string

  /**
   * Optionally provide an array of postcss plugins to use during CSS
   * compilation.
   */
  postcssPlugins?: Array<postcss.AcceptedPlugin>

  /**
   * Optionally provide options to pass forward to `postcss-modules` when
   * compiling CSS
   */
  postcssModulesOptions?: Parameters<typeof postcssModules>[0]
}

export function importCSS(options: ImportCSSOptions): Plugin {
  const {modulesRoot, postcssPlugins = [], postcssModulesOptions = {}} = options
  const rootDirectory = path.isAbsolute(modulesRoot) ? modulesRoot : path.resolve(process.cwd(), modulesRoot)

  return {
    name: 'import-css',
    resolveId(source, importer) {
      if (!importer) {
        return
      }

      const moduleInfo = this.getModuleInfo(importer)
      if (moduleInfo?.meta['import-css']?.source === source) {
        return {
          id: source,
          external: true,
          moduleSideEffects: true,
        }
      }

      if (source.endsWith('.css')) {
        const id = path.resolve(path.dirname(importer), source)
        return path.format({
          dir: path.dirname(id),
          base: `${path.basename(id)}.js`,
        })
      }
    },
    async load(id) {
      if (id.endsWith('.css.js')) {
        return ''
      }
    },
    async transform(_code, id) {
      if (!id.endsWith('.css.js')) {
        return
      }

      const sourceId = path.join(path.dirname(id), path.basename(id, '.js'))
      const code = await fs.readFile(sourceId, 'utf8')
      const hash = getSourceHash(code)
      const relativePath = path.relative(rootDirectory, sourceId)
      const name = path.basename(relativePath, relativePath.endsWith('.module.css') ? '.module.css' : '.css')
      const fileName = path.join(
        path.dirname(relativePath),
        path.format({
          name: `${name}-${hash}`,
          ext: '.css',
        }),
      )

      // When transforming CSS modules, we want to emit the generated CSS as an
      // asset and include the generated file in our generated CSS Modules file
      // which contains the classes. This makes sure that if the file containing
      // the classes is used, then the associated styles for those classes is
      // also included

      let cssModuleClasses: {[name: string]: string} | null = null
      const result = await postcss([
        ...postcssPlugins,
        postcssModules({
          ...postcssModulesOptions,
          getJSON(filename, json) {
            if (postcssModulesOptions.getJSON) {
              postcssModulesOptions.getJSON(filename, json)
            }
            cssModuleClasses = json
          },
        }),
      ]).process(code, {
        from: id,
        to: fileName,
        map: {
          inline: false,
        },
      })

      this.emitFile({
        type: 'asset',
        source: result.css,
        fileName,
      })
      this.emitFile({
        type: 'asset',
        source: result.map.toString(),
        fileName: `${fileName}.map`,
      })

      const moduleInfo = this.getModuleInfo(id)
      const cssSource = `./${path.basename(fileName)}`
      if (moduleInfo) {
        moduleInfo.meta['import-css'] = {
          source: cssSource,
        }
      }

      return {
        code: `
          import '${cssSource}';
          ${cssModuleClasses !== null ? `export default ${JSON.stringify(cssModuleClasses)}` : ''}
        `,
        moduleSideEffects: 'no-treeshake',
      }
    },
  }
}

const DEFAULT_HASH_SIZE = 8

function getSourceHash(source: string) {
  return createHash('sha256').update(source).digest('hex').slice(0, DEFAULT_HASH_SIZE)
}
