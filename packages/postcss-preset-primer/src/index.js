import {readFileSync, existsSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {globSync} from 'glob'
import postcssGlobalData from '@csstools/postcss-global-data'
import postcssPresetEnv from 'postcss-preset-env'
import postcssMixins from 'postcss-mixins'
import cssnano from 'cssnano'
// @ts-expect-error this plugin does not have a declaration file
import customPropertiesFallback from 'postcss-custom-properties-fallback'
// @ts-expect-error this plugin does not have a declaration file
import browsers from '@github/browserslist-config'

const filepath = fileURLToPath(import.meta.url)
const {root: ROOT_DIR} = path.parse(filepath)

/**
 * @typedef {Object} PluginOptions
 */

/**
 * @type {import('postcss').PluginCreator<PluginOptions>}
 */
const postcssPresetPrimer = () => {
  const primitivesPaths = ancestors(filepath).flatMap(directory => {
    if (directory.endsWith('node_modules') && existsSync(path.join(directory, '@primer', 'primitives'))) {
      return path.join(directory, '@primer', 'primitives')
    }

    if (existsSync(path.join(directory, 'node_modules', '@primer', 'primitives'))) {
      return path.join(directory, 'node_modules', '@primer', 'primitives')
    }

    return []
  })

  if (primitivesPaths.length === 0) {
    throw new Error('Unable to resolve @primer/primitives')
  }

  const [primitivesPath] = primitivesPaths

  return {
    postcssPlugin: 'postcss-preset-primer',
    // Note: plugins passed into here must be called as functions and cannot use
    // array syntax typically used in PostCSS config. Also, presets that use
    // their own plugins won't work by default. We need to pull the plugins out
    // and apply them from the preset
    plugins: [
      postcssGlobalData({
        files: globSync('dist/css/**/*.css', {
          cwd: primitivesPath,
        }).map(file => {
          return path.join(primitivesPath, file)
        }),
      }),
      postcssMixins({
        mixinsDir: path.join(path.dirname(filepath), 'mixins'),
      }),
      customPropertiesFallback({
        importFrom: [
          () => {
            let customProperties = {}
            const filePaths = globSync(['dist/fallbacks/**/*.json', 'dist/docs/functional/themes/light.json'], {
              cwd: primitivesPath,
              ignore: ['fallbacks/color-fallbacks.json'],
            })

            for (const filePath of filePaths) {
              const fileData = readFileSync(path.join(primitivesPath, filePath), 'utf8')

              const jsonData = JSON.parse(fileData)
              let result = {}

              if (filePath === 'dist/docs/functional/themes/light.json') {
                for (const variable of Object.keys(jsonData)) {
                  // @ts-expect-error this value is untyped, will be fixed when
                  // converted to TypeScript
                  result[`--${variable}`] = jsonData[variable].value
                }
              } else {
                result = jsonData
              }

              customProperties = {
                ...customProperties,
                ...result,
              }
            }

            return {customProperties}
          },
        ],
      }),
      ...plugins(
        postcssPresetEnv({
          stage: 2,
          browsers,
          // https://preset-env.cssdb.org/features/#stage-2
          features: {
            'nesting-rules': {
              noIsPseudoSelector: true,
            },
            'focus-visible-pseudo-class': false,
            'logical-properties-and-values': false,
          },
        }),
      ),
      ...plugins(cssnano()),
    ],
  }
}

postcssPresetPrimer.postcss = true

/**
 * Returns an array of the directory and its ancestors
 * @param {string} directory
 * @returns {Array<string>}
 */
function ancestors(directory) {
  const result = []
  let current = directory

  while (current !== '') {
    result.push(current)

    if (current !== ROOT_DIR) {
      current = path.dirname(current)
    } else {
      current = ''
    }
  }

  return result
}

/**
 * Returns array of plugins from the given PostCSS preset
 * @param {import('postcss').Processor | import('postcss').Plugin} preset
 * @returns {Array<any>}
 */
function plugins(preset) {
  return 'plugins' in preset ? preset.plugins : []
}

export default postcssPresetPrimer
