import presetPrimer from 'postcss-preset-primer'

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [presetPrimer()],
}

export default config
