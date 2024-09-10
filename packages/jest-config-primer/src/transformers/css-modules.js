'use strict'

const {spawnSync} = require('node:child_process')
const {createHash} = require('node:crypto')
const fs = require('fs')
const path = require('path')
const {default: postcss} = require('postcss')
const postcssModules = require('postcss-modules')

const THIS_FILE = fs.readFileSync(__filename, 'binary')

const RUNNER_PATH = require.resolve('./postcss-runner.mjs')

/**
 * @type {import('@jest/transform').Transformer}
 */
module.exports = {
  process(_file, sourcePath) {
    const {stdout, stderr} = spawnSync('node', [
      '-e',
      `import("${RUNNER_PATH}").then((mod) => mod.process("${sourcePath}"))`,
    ])

    if (stderr.length > 0) {
      throw new Error(stderr.toString())
    }

    const result = JSON.parse(stdout.toString())
    if (result.error) {
      throw new Error(result.error)
    }

    return {
      code: `
        if (typeof document !== 'undefined') {
          const css = \`${result.css}\`;
          const style = document.createElement('style')
          style.type = 'text/css'

          document.head.appendChild(style);
          style.appendChild(document.createTextNode(css))
        }
        module.exports = ${JSON.stringify(result.cssModuleClasses)};
      `,
    }
  },
  async processAsync(file, sourcePath) {
    let cssModuleClasses = null

    const result = await postcss([
      postcssModules({
        generateScopedName: 'prc_[local]_[hash:base64:5]',
        getJSON(_filename, json) {
          cssModuleClasses = json
        },
      }),
    ]).process(file.toString(), {
      from: sourcePath,
    })

    return {
      code: `
        if (typeof document !== 'undefined') {
          const css = \`${result.css.toString()}\`;
          const style = document.createElement('style')
          style.type = 'text/css'

          document.head.appendChild(style);
          style.appendChild(document.createTextNode(css))
        }

        module.exports = ${JSON.stringify(cssModuleClasses)};
      `,
    }
  },
  getCacheKey(sourceText, sourcePath, transformOptions) {
    const {config, configString, instrument} = transformOptions
    return createHash('md5')
      .update(THIS_FILE)
      .update('\0', 'utf8')
      .update(sourceText)
      .update('\0', 'utf8')
      .update(path.relative(config.rootDir, sourcePath))
      .update('\0', 'utf8')
      .update(configString)
      .update('\0', 'utf8')
      .update(instrument ? 'instrument' : '')
      .update('\0', 'utf8')
      .update(process.version)
      .digest('hex')
  },
}
