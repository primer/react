import {createRequire} from 'node:module'
import path from 'node:path'
import postcssPresetPrimer from 'postcss-preset-primer'
import type {StorybookConfig} from '@storybook/react-vite'

const require = createRequire(import.meta.url)

const {DEPLOY_ENV = 'development'} = process.env

const config: StorybookConfig = {
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
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    config.define = {
      ...config.define,
      __DEV__: JSON.stringify(true),
    }

    config.css = {
      ...config.css,
      modules: {
        ...config.css?.modules,
        generateScopedName: 'prc_[local]_[hash:base64:5]',
      },
      postcss: {
        ...config.css?.postcss,
        plugins: [postcssPresetPrimer()],
      },
    }

    return config
  },
}

export default config

function getAbsolutePath(value) {
  return path.dirname(require.resolve(path.join(value, 'package.json')))
}
