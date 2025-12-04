import {createRequire} from 'node:module'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import react from '@vitejs/plugin-react'
import postcssPresetPrimer from 'postcss-preset-primer'
import type {StorybookConfig} from '@storybook/react-vite'
import {isSupported} from '../script/react-compiler.mjs'
import {getCodeEditorStaticDirs} from 'storybook-addon-code-editor/getStaticDirs'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)

const {DEPLOY_ENV = 'development'} = process.env

const config: StorybookConfig = {
  staticDirs: [...getCodeEditorStaticDirs(__filename)],
  stories:
    DEPLOY_ENV === 'development'
      ? ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)']
      : // Don't include dev stories in production
        ['../src/**/*.mdx', '../src/**/!(*.dev).stories.@(js|jsx|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('storybook-addon-code-editor'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {
      strictMode: true,
    },
  },

  async viteFinal(config) {
    config.define = {
      ...config.define,
      __DEV__: JSON.stringify(true),
    }

    if (!config.css) {
      config.css = {}
    }

    if (!config.css.modules) {
      config.css.modules = {}
    }

    config.css.modules.generateScopedName = 'prc-[folder]-[local]-[hash:base64:5]'

    if (!config.css.postcss) {
      config.css.postcss = {}
    }

    if (typeof config.css.postcss !== 'string') {
      config.css.postcss.plugins = [postcssPresetPrimer()]
    }

    config.plugins = [
      ...(config.plugins ?? []),
      react({
        babel: {
          plugins: [
            [
              'babel-plugin-react-compiler',
              {
                sources: (filepath: string) => isSupported(filepath),
                target: '18',
              },
            ],
          ],
        },
      }),
    ]

    if (DEPLOY_ENV === 'development') {
      config.server = {
        ...config.server,
        allowedHosts: ['localhost', 'host.docker.internal'],
      }
    }

    return config
  },

  features: {
    backgrounds: false,
  },
}

export default config

function getAbsolutePath(value: string) {
  return path.dirname(require.resolve(path.join(value, 'package.json')))
}
