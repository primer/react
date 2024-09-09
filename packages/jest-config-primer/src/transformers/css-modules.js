'use strict'

const {createHash} = require('node:crypto')
const fs = require('fs')
const path = require('path')
const {default: postcss} = require('postcss')
const postcssModules = require('postcss-modules')

const THIS_FILE = fs.readFileSync(__filename)

/**
 * @type {import('@jest/transform').Transformer}
 */
module.exports = {
  async processAsync(file, sourcePath) {
    let cssModuleClasses = null

    const result = await postcss([
      postcssModules({
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

          // List of features that are currently not parseable by the internal version of jsdom managed by
          // jest-environment-jsdom
          const unsupportedFeatures = ['@layer', '@container'];
          const hasUnsupportedFeature = unsupportedFeatures.find((feature) => {
            return css.includes(feature);
          })

          if (!hasUnsupportedFeature) {
            const style = document.createElement('style')
            style.type = 'text/css'

            document.head.appendChild(style);
            style.appendChild(document.createTextNode(css))
          }
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
