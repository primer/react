import babelJest from 'babel-jest'

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['babel-plugin-transform-import-meta'],
}

export default babelJest.createTransformer(babelOptions)
