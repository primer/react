import type {StoryFn, Meta} from '@storybook/react-vite'
import Text from './Text'

export default {
  title: 'Components/Text',
  component: Text,
} as Meta<typeof Text>

export const Default = () => <Text>Default Text</Text>

export const Playground: StoryFn<typeof Text> = args => <Text {...args}>Playground</Text>

Playground.args = {
  as: 'span',
  size: 'medium',
  weight: 'normal',
}

Playground.argTypes = {
  as: {
    type: 'string',
  },
  sx: {
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
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
  weight: {
    control: {
      type: 'radio',
    },
    options: ['light', 'normal', 'medium', 'semibold'],
  },
}
