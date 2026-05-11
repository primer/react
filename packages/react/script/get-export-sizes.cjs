'use strict'

const fs = require('node:fs/promises')
const path = require('node:path')
const core = require('@actions/core')
const commonjs = require('@rollup/plugin-commonjs')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const virtual = require('@rollup/plugin-virtual')
const json = require('@rollup/plugin-json')
const cssstats = require('cssstats')
const {filesize} = require('filesize')
const {rollup} = require('rollup')
const specificity = require('specificity')
const {minify} = require('terser')
const gzipSize = require('gzip-size')

// Default thresholds flag component-sized CSS files and selector scores that are high enough to review.
const CSS_SIZE_WARNING_THRESHOLD_BYTES = Number(process.env.CSS_SIZE_WARNING_THRESHOLD_BYTES ?? 10 * 1024)
const CSS_SELECTOR_SPECIFICITY_WARNING_THRESHOLD = Number(process.env.CSS_SELECTOR_SPECIFICITY_WARNING_THRESHOLD ?? 50)
const SPECIFICITY_ID_WEIGHT = 100
const SPECIFICITY_CLASS_WEIGHT = 10
const SPECIFICITY_ELEMENT_WEIGHT = 1

function createCSSModulesCollector(cssModules, cssImportsByImporter) {
  return {
    name: 'collect-css-modules',

    resolveId(source, importer) {
      if (!source.endsWith('.css') || !importer) {
        return null
      }

      const id = path.resolve(path.dirname(importer), source)
      const imports = cssImportsByImporter.get(importer) ?? new Set()
      imports.add(id)
      cssImportsByImporter.set(importer, imports)

      return null
    },

    async transform(_code, id) {
      if (!id.endsWith('.css')) {
        return
      }

      cssModules.set(id, await fs.readFile(id, 'utf8'))

      return {
        code: `export default {}`,
      }
    },
  }
}

async function main() {
  const rootDirectory = path.resolve(__dirname, '..')
  const packageJsonPath = path.join(rootDirectory, 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
  const external = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
  ].map(name => {
    return new RegExp(`^${name}(/.*)?`)
  })
  const entrypoints = getEntrypoints(packageJson)
  const data = {
    entrypoints: [],
  }

  core.info('Analyzing entrypoints...')

  for (const entrypoint of entrypoints) {
    core.info(`Analyzing entrypoint:  ${entrypoint.entrypoint}`)

    const filepath = path.resolve(rootDirectory, entrypoint.filepath)
    const cssModules = new Map()
    const cssImportsByImporter = new Map()
    const bundle = await rollup({
      input: filepath,
      external,
      plugins: [
        nodeResolve(),
        commonjs({
          include: [/node_modules/],
        }),
        json(),
        createCSSModulesCollector(cssModules, cssImportsByImporter),
      ],
      onwarn: () => {},
    })
    const {output} = await bundle.generate({
      format: 'esm',
    })
    const minified = await minify(output[0].code)
    const css = await getCSSInfo(rootDirectory, cssModules, cssImportsByImporter, output[0])
    const exports = []

    core.startGroup('Analyzing exports...')

    for (const identifier of output[0].exports) {
      core.info(`Analyzing export: ${identifier}`)

      const exportCSSModules = new Map()
      const exportCSSImportsByImporter = new Map()
      const reexport = await rollup({
        input: '__entrypoint__',
        external,
        plugins: [
          nodeResolve(),
          commonjs({
            include: /node_modules/,
          }),
          createCSSModulesCollector(exportCSSModules, exportCSSImportsByImporter),
          json(),
          virtual({
            __entrypoint__: `export { ${identifier} } from '${filepath}';`,
          }),
        ],
        onwarn: () => {},
      })
      const {output} = await reexport.generate({
        format: 'esm',
      })
      const minified = await minify(output[0].code)
      const css = await getCSSInfo(rootDirectory, exportCSSModules, exportCSSImportsByImporter, output[0])

      exports.push({
        identifier,
        unminified: Buffer.byteLength(output[0].code),
        minified: Buffer.byteLength(minified.code),
        gzipUnminified: await gzipSize(output[0].code),
        gzipMinified: await gzipSize(minified.code),
        css,
      })
    }

    core.endGroup()

    data.entrypoints.push({
      ...entrypoint,
      unminified: Buffer.byteLength(output[0].code),
      minified: Buffer.byteLength(minified.code),
      gzipUnminified: await gzipSize(output[0].code),
      gzipMinified: await gzipSize(minified.code),
      css,
      exports,
    })
  }

  const reportPath = process.env.EXPORT_SIZE_REPORT_PATH
    ? path.resolve(process.cwd(), process.env.EXPORT_SIZE_REPORT_PATH)
    : path.join(rootDirectory, 'dist', 'export-size-report.json')

  await fs.mkdir(path.dirname(reportPath), {recursive: true})
  await fs.writeFile(
    reportPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        thresholds: {
          cssSizeWarningBytes: CSS_SIZE_WARNING_THRESHOLD_BYTES,
          cssSelectorSpecificityWarning: CSS_SELECTOR_SPECIFICITY_WARNING_THRESHOLD,
        },
        ...data,
      },
      null,
      2,
    )}\n`,
  )
  core.info(`Wrote export size report to ${reportPath}`)

  if (process.env.CI) {
    await core.summary
      .addHeading('Sizes')
      .addTable([
        [
          {
            data: 'Entrypoint',
            header: true,
          },
          {
            data: 'Export',
            header: true,
          },
          {
            data: 'CSS Gzip',
            header: true,
          },
          {
            data: 'CSS Size',
            header: true,
          },
          {
            data: 'CSS Rules',
            header: true,
          },
          {
            data: 'CSS Selectors',
            header: true,
          },
          {
            data: 'CSS Declarations',
            header: true,
          },
          {
            data: 'CSS Specificity (max)',
            header: true,
          },
          {
            data: 'Gzip',
            header: true,
          },
          {
            data: 'Gzip (unminified)',
            header: true,
          },
          {
            data: 'Size',
            header: true,
          },
          {
            data: 'Size (unminified)',
            header: true,
          },
        ],
        ...data.entrypoints
          .sort((a, b) => {
            return b.gzipMinified - a.gzipMinified
          })
          .flatMap(entrypoint => {
            return [
              [
                entrypoint.entrypoint === '.' ? '@primer/react' : path.join('@primer/react', entrypoint.entrypoint),
                '*',
                filesize(entrypoint.css.gzip),
                filesize(entrypoint.css.size),
                String(entrypoint.css.stats.rules.total),
                String(entrypoint.css.stats.selectors.total),
                String(entrypoint.css.stats.declarations.total),
                String(entrypoint.css.stats.selectors.specificity.max),
                filesize(entrypoint.gzipMinified),
                filesize(entrypoint.gzipUnminified),
                filesize(entrypoint.minified),
                filesize(entrypoint.unminified),
              ],
              ...entrypoint.exports
                .sort((a, b) => {
                  return b.gzipMinified - a.gzipMinified
                })
                .map(exportInfo => {
                  return [
                    '',
                    exportInfo.identifier,
                    filesize(exportInfo.css.gzip),
                    filesize(exportInfo.css.size),
                    String(exportInfo.css.stats.rules.total),
                    String(exportInfo.css.stats.selectors.total),
                    String(exportInfo.css.stats.declarations.total),
                    String(exportInfo.css.stats.selectors.specificity.max),
                    filesize(exportInfo.gzipMinified),
                    filesize(exportInfo.gzipUnminified),
                    filesize(exportInfo.minified),
                    filesize(exportInfo.unminified),
                  ]
                }),
            ]
          }),
      ])
      .write()
  }
}

async function getCSSInfo(rootDirectory, cssModules, cssImportsByImporter, chunk) {
  const cssModuleIds = new Set()

  if (chunk.type === 'chunk') {
    for (const moduleId of Object.keys(chunk.modules)) {
      if (cssModules.has(moduleId)) {
        cssModuleIds.add(moduleId)
      }

      const imports = cssImportsByImporter.get(moduleId)
      if (imports) {
        for (const id of imports) {
          cssModuleIds.add(id)
        }
      }
    }
  }

  const code = Array.from(cssModuleIds, id => cssModules.get(id)).join('\n')

  if (code.length === 0) {
    return {
      size: 0,
      gzip: 0,
      stats: getEmptyCSSStats(),
      stylesheets: [],
      warnings: {
        stylesheetsOverSize: [],
        highSpecificitySelectors: [],
      },
    }
  }

  const stylesheets = await Promise.all(
    Array.from(cssModuleIds)
      .sort()
      .map(async id => {
        const stylesheetCode = cssModules.get(id)
        const size = Buffer.byteLength(stylesheetCode)
        const stats = cssstats(stylesheetCode).toJSON()
        const stylesheet = {
          path: path.relative(rootDirectory, id),
          size,
          gzip: await gzipSize(stylesheetCode),
          stats,
          warnings: {
            size:
              size >= CSS_SIZE_WARNING_THRESHOLD_BYTES
                ? {
                    threshold: CSS_SIZE_WARNING_THRESHOLD_BYTES,
                    actual: size,
                  }
                : null,
            highSpecificitySelectors: getHighSpecificitySelectors(stats.selectors.values ?? []),
          },
        }

        return stylesheet
      }),
  )
  const stylesheetsOverSize = stylesheets
    .filter(stylesheet => stylesheet.warnings.size)
    .map(stylesheet => {
      return {
        path: stylesheet.path,
        threshold: stylesheet.warnings.size.threshold,
        actual: stylesheet.warnings.size.actual,
      }
    })
  const highSpecificitySelectors = stylesheets.flatMap(stylesheet => {
    return stylesheet.warnings.highSpecificitySelectors.map(selector => {
      return {
        stylesheet: stylesheet.path,
        ...selector,
      }
    })
  })

  return {
    size: Buffer.byteLength(code),
    gzip: await gzipSize(code),
    stats: cssstats(code).toJSON(),
    stylesheets,
    warnings: {
      stylesheetsOverSize,
      highSpecificitySelectors,
    },
  }
}

function getEmptyCSSStats() {
  return {
    rules: {
      total: 0,
    },
    selectors: {
      total: 0,
      specificity: {
        max: 0,
      },
    },
    declarations: {
      total: 0,
    },
  }
}

function getHighSpecificitySelectors(selectors) {
  return selectors
    .flatMap(selector => {
      return specificity.calculate(selector).map(result => {
        return {
          selector: result.selector.trim(),
          specificity: getSpecificityValue(result.specificityArray),
          specificityArray: result.specificityArray,
        }
      })
    })
    .filter(result => {
      return result.specificity >= CSS_SELECTOR_SPECIFICITY_WARNING_THRESHOLD
    })
    .sort((a, b) => {
      return b.specificity - a.specificity
    })
}

function getSpecificityValue(specificityArray) {
  // specificityArray is [inline, ids, classes/attributes/pseudo-classes, elements/pseudo-elements].
  // CSS selectors cannot include inline style specificity, so index 0 is not included in this score.
  // These weights follow CSS specificity scoring: IDs > classes/attributes/pseudo-classes > elements.
  return (
    specificityArray[1] * SPECIFICITY_ID_WEIGHT +
    specificityArray[2] * SPECIFICITY_CLASS_WEIGHT +
    specificityArray[3] * SPECIFICITY_ELEMENT_WEIGHT
  )
}

function getEntrypoints(packageJson) {
  if (packageJson.exports) {
    return getPackageExports(packageJson.exports, packageJson.type)
  }

  if (packageJson.module) {
    return [
      {
        entrypoint: '.',
        filepath: packageJson.module,
        type: 'module',
      },
    ]
  }

  if (packageJson.main) {
    return [
      {
        entrypoint: '.',
        filepath: packageJson.main,
        type: 'commonjs',
      },
    ]
  }

  return []
}

function getPackageExports(exportMap, type = 'commonjs') {
  // "exports": "./index.js"
  if (typeof exportMap === 'string') {
    return [
      {
        entrypoint: '.',
        filepath: exportMap,
        type,
      },
    ]
  }

  if (typeof exportMap === 'object') {
    return Object.entries(exportMap)
      .filter(([key]) => {
        // We currently ignore wildcard imports
        return !key.includes('*')
      })
      .map(([key, value]) => {
        //
        // "exports": {
        //   ".": "./index.js",
        //   "./lib-esm/*": [],
        // }
        //
        if (typeof value === 'string') {
          return {
            entrypoint: key,
            filepath: value,
            type,
          }
        }

        //
        // "exports": {
        //   ".": {
        //     "import": "./index.js",
        //     "require": "./index.js"
        //   },
        //   "./lib-esm/*": {
        //     "import": [],
        //     "require": []
        //   }
        // }
        //
        if (value.import) {
          return {
            entrypoint: key,
            filepath: value.import,
            type: 'module',
          }
        }

        if (value.default) {
          return {
            entrypoint: key,
            filepath: value.default,
            // This should be the type of the module but currently older
            // versions of @primer/react use node to mean ESM
            type: 'module',
          }
        }

        if (value.require) {
          return {
            entrypoint: key,
            filepath: value.require,
            type: 'commonjs',
          }
        }

        if (value.node) {
          return {
            entrypoint: key,
            filepath: value.node,
            // This should be the type of the module but currently older
            // versions of @primer/react use node to mean ESM
            type: 'module',
          }
        }

        throw new Error(`Unsupported export value for entrypoint \`${key}\`: ${value}`)
      })
  }

  throw new Error(`Unknown exports format: ${exportMap}`)
}

// eslint-disable-next-line github/no-then
main().catch(error => {
  core.error(error)
  process.exit(1)
})
