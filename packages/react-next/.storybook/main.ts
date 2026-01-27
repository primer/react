import type {StorybookConfig} from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  stories: ['../src/**/!(*.dev).stories.@(js|jsx|ts|tsx)'],

  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: true,
    },
  },

  async viteFinal(config) {
    // Deduplicate React to prevent "Invalid hook call" errors
    // This ensures @base-ui/react uses the same React instance as the app
    config.resolve = {
      ...config.resolve,
      dedupe: ['react', 'react-dom'],
    }

    config.plugins = [...(config.plugins || []), tailwindcss()]

    return config
  },
}

export default config
