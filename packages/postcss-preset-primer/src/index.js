import {existsSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {globSync} from 'glob'

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
    plugins: [
      [
        '@csstools/postcss-global-data',
        {
          files: globSync('dist/css/**/*.css', {
            cwd: primitivesPath,
          }),
        },
      ],
      [
        'postcss-preset-env',
        {
          stage: 2,
          // https://preset-env.cssdb.org/features/#stage-2
          features: {
            'nesting-rules': {
              noIsPseudoSelector: true,
            },
            'focus-visible-pseudo-class': false,
            'logical-properties-and-values': false,
          },
        },
      ],
    ],
  }
}

postcssPresetPrimer.postcss = true

/**
 * Returns an array of the the directory and its ancestors
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

export default postcssPresetPrimer
