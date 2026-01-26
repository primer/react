import type {Preview, ReactRenderer} from '@storybook/react-vite'
import type {DecoratorFunction} from 'storybook/internal/types'
import React from 'react'

import './styles.css'

const ThemeDecorator: DecoratorFunction<ReactRenderer> = (Story, context) => {
  const theme = context.globals.theme || 'light'

  return (
    <div data-color-mode={theme} data-light-theme="light" data-dark-theme="dark">
      <Story />
    </div>
  )
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Disable Storybook's default backgrounds so they don't interfere
    backgrounds: {disabled: true},
    // Configure docs to not apply default background
    docs: {
      story: {
        inline: true,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          {value: 'light', title: 'Light', icon: 'sun'},
          {value: 'dark', title: 'Dark', icon: 'moon'},
        ],
      },
    },
  },
}

export default preview
