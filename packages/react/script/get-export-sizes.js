'use strict'

const fs = require('node:fs/promises')
const path = require('node:path')
const core = require('@actions/core')
const commonjs = require('@rollup/plugin-commonjs')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const virtual = require('@rollup/plugin-virtual')
const json = require('@rollup/plugin-json')
const {filesize} = require('filesize')
const {rollup} = require('rollup')
const {minify} = require('terser')
const gzipSize = require('gzip-size')

const noopCSSModules = {
  name: 'empty-css-modules',

  transform(_code, id) {
    if (!id.endsWith('.css')) {
      return
    }
    return {
      code: `export default {}`,
    }
  },
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
    const bundle = await rollup({
      input: filepath,
      external,
      plugins: [
        nodeResolve(),
        commonjs({
          include: [/node_modules/],
        }),
        json(),
        noopCSSModules,
      ],
      onwarn: () => {},
    })
    const {output} = await bundle.generate({
      format: 'esm',
    })
    const minified = await minify(output[0].code)
    const exports = []

    core.startGroup('Analyzing exports...')

    for (const identifier of output[0].exports) {
      core.info(`Analyzing export: ${identifier}`)

      const reexport = await rollup({
        input: '__entrypoint__',
        external,
        plugins: [
          nodeResolve(),
          commonjs({
            include: /node_modules/,
          }),
          noopCSSModules,
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

      exports.push({
        identifier,
        unminified: Buffer.byteLength(output[0].code),
        minified: Buffer.byteLength(minified.code),
        gzipUnminified: await gzipSize(output[0].code),
        gzipMinified: await gzipSize(minified.code),
      })
    }

    core.endGroup()

    data.entrypoints.push({
      ...entrypoint,
      unminified: Buffer.byteLength(output[0].code),
      minified: Buffer.byteLength(minified.code),
      gzipUnminified: await gzipSize(output[0].code),
      gzipMinified: await gzipSize(minified.code),
      exports,
    })
  }

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
