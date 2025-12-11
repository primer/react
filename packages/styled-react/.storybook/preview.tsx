import type {Preview, Decorator} from '@storybook/react-vite'
import {BaseStyles} from '@primer/react'
import './global.css'

const preview: Preview = {
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
}

export const decorators: Array<Decorator> = [
  (Story, context) => {
    return (
      <BaseStyles data-light-theme="light" data-dark-theme="dark" data-color-mode="auto">
        <Story {...context} />
      </BaseStyles>
    )
  },
  (Story, context) => {
    return (
      <div data-testid="screenshot">
        <Story {...context} />
      </div>
    )
  },
]

export default preview
