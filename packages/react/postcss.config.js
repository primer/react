/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 2, // https://preset-env.cssdb.org/features/#stage-2
      features: {
        'nesting-rules': {noIsPseudoSelector: true},
        'focus-visible-pseudo-class': false,
        'logical-properties-and-values': false,
      },
    }),
  ],
}
