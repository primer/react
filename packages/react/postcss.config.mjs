import postcssPresetPrimer from 'postcss-preset-primer'

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [postcssPresetPrimer()],
}

export default config
