import type {Meta, StoryFn} from '@storybook/react-vite'
import Flash from './Flash'

export default {
  title: 'Components/Flash',
  component: Flash,
} as Meta<typeof Flash>

export const Default = () => <Flash>Default</Flash>

export const Playground: StoryFn<typeof Flash> = args => <Flash {...args}>Default</Flash>

Playground.args = {
  variant: 'default',
}

Playground.argTypes = {
  as: {
    controls: false,
    table: {
      disable: true,
    },
  },
  ref: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
