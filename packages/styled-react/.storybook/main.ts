import type {StorybookConfig} from '@storybook/react-vite'
import react from '@vitejs/plugin-react'
import postcssPresetPrimer from 'postcss-preset-primer'

const {DEPLOY_ENV = 'development'} = process.env

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: true,
    },
  },

  async viteFinal(config) {
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
