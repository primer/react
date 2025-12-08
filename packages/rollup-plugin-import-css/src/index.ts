import type {Plugin} from 'rollup'
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
        // console.log(source)
        return {
          id: source,
          external: 'relative',
        }
      }

      if (source.endsWith('.css')) {
        const id = path.resolve(path.dirname(importer), source)
        return {
          id,
          moduleSideEffects: true,
        }
      }
    },
    async transform(code, id) {
      if (!id.endsWith('.css')) {
        return
      }

      const hash = getSourceHash(code)
      const relativePath = path.relative(rootDirectory, id)
      const isCSSModule = id.endsWith('.module.css')
      const name = isCSSModule ? path.basename(relativePath, '.module.css') : path.basename(relativePath, '.css')

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

      let cssModuleClasses = null
      const plugins = [...postcssPlugins]

      if (isCSSModule) {
        plugins.push(
          postcssModules({
            ...postcssModulesOptions,
            getJSON(filename, json) {
              if (postcssModulesOptions.getJSON) {
                postcssModulesOptions.getJSON(filename, json)
              }
              cssModuleClasses = json
            },
          }),
        )
      }

      const result = await postcss(plugins).process(code, {
        from: id,
        to: fileName,
        map: {
          inline: false,
        },
      })

      const cssReferenceId = this.emitFile({
        type: 'asset',
        source: result.css,
        fileName,
      })
      console.log('REFERENCE ID:', cssReferenceId)
      console.log(this.getFileName(cssReferenceId))

      this.emitFile({
        type: 'asset',
        source: result.map.toString(),
        fileName: `${fileName}.map`,
      })

      const moduleInfo = this.getModuleInfo(id)
      // const cssSource = `./${path.basename(fileName)}`
      const cssSource = path.join(rootDirectory, fileName)
      if (moduleInfo) {
        moduleInfo.meta['import-css'] = {
          source: cssSource,
          // source: fileName,
        }
      }

      return {
        code: [
          `import '${cssSource}';`,
          'console.log(1);',
          cssModuleClasses ? `export default ${JSON.stringify(cssModuleClasses)};` : null,
        ]
          .filter(Boolean)
          .join('\n'),
      }
    },
  }
}

const DEFAULT_HASH_SIZE = 8

function getSourceHash(source: string) {
  return createHash('sha256').update(source).digest('hex').slice(0, DEFAULT_HASH_SIZE)
}
