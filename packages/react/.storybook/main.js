import {dirname, join, resolve} from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import presetPrimer from 'postcss-preset-primer'

const {DEPLOY_ENV = 'development'} = process.env

/**
 * @type {import('@storybook/react').StorybookConfig}
 */
module.exports = {
  stories:
    DEPLOY_ENV === 'development'
      ? ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)']
      : // Don't include dev stories in production
        ['../src/**/*.mdx', '../src/**/!(*.dev).stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    {
      name: 'storybook-addon-turbo-build',
      options: {
        optimizationLevel: 2,
      },
    },
    // {
    // name: '@storybook/addon-styling-webpack',
    // options: {
    // rules: [
    // {
    // test: /\.css$/,
    // use: [
    // 'style-loader',
    // {
    // loader: 'css-loader',
    // options: {
    // importLoaders: 1,
    // modules: {
    // localIdentName: 'prc-[folder]-[local]-[hash:base64:5]',
    // },
    // },
    // },
    // {
    // // Gets options from `postcss.config.js` in your project root
    // loader: 'postcss-loader',
    // options: {implementation: require.resolve('postcss')},
    // },
    // ],
    // },
    // ],
    // },
    // },
    '@storybook/addon-webpack5-compiler-babel',
  ],
  features: {
    interactionsDebugger: true,
    // storyStoreV7: true,
    buildStoriesJson: true,
  },
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {
      fastRefresh: true,
      strictMode: true,
      builder: {
        fsCache: true,
      },
    },
  },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen',
  },
  previewHead: head => {
    if (DEPLOY_ENV === 'development') {
      return head
    }
    return `${head}\n<meta name="ha-url" content="https://collector.githubapp.com/primer/collect">`
  },
  previewBody: body => {
    if (DEPLOY_ENV === 'development') {
      return body
    }
    return `${body}\n<script src="https://analytics.githubassets.com/hydro-marketing.min.js"></script>`
  },
  webpackFinal(config, {configType}) {
    const cssRule = config.module.rules.findIndex(rule => {
      return rule.test.toString() === '/\\.css$/'
    })
    if (cssRule !== -1) {
      config.module.rules.splice(cssRule, 1)
    }

    config.module.rules.push({
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: 'prc-[folder]-[local]-[hash:base64:5]',
              namedExport: false,
              exportLocalsConvention: 'as-is',
            },
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            implementation: require.resolve('postcss'),
            postcssOptions: {
              plugins: [presetPrimer()],
            },
          },
        },
      ],
    })

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: configType === 'DEVELOPMENT' ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: configType === 'DEVELOPMENT' ? '[id].css' : '[id].[contenthash].css',
      }),
    )

    return config
  },
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}
