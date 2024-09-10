import fs from 'node:fs/promises'
import postcss from 'postcss'
import postcssModules from 'postcss-modules'
import postcssPresetPrimer from 'postcss-preset-primer'

/**
 * @param {string} filepath
 */
export async function process(filepath) {
  try {
    const contents = await fs.readFile(filepath, 'utf8')
    let cssModuleClasses = null

    const result = await postcss([
      postcssPresetPrimer(),
      postcssModules({
        generateScopedName: 'prc_[local]_[hash:base64:5]',
        getJSON(_filename, json) {
          cssModuleClasses = json
        },
      }),
    ]).process(contents, {
      from: filepath,
    })

    console.log(
      JSON.stringify({
        css: result.css.toString(),
        cssModuleClasses,
      }),
    )
  } catch (error) {
    console.log(
      JSON.stringify({
        error,
      }),
    )
  }
}
