import type {Meta, StoryFn} from '@storybook/react-vite'
import Box from './Box'

export default {
  title: 'Deprecated/Components/Box',
  component: Box,
} as Meta<typeof Box>

export const Default = () => <Box>Default Box</Box>

export const Playground: StoryFn<typeof Box> = args => <Box {...args}>Playground</Box>

Playground.args = {
  as: 'div',
  sx: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'border.default',
    p: 3,
  },
}

Playground.argTypes = {
  forwardedAs: {
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
  theme: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
