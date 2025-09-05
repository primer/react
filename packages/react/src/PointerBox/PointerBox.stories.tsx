import type {StoryFn, Meta} from '@storybook/react-vite'
import PointerBox from './PointerBox'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Deprecated/Components/PointerBox',
  parameters: {
    docs: {
      description: {
        component: 'PointerBox is deprecated and will be removed in a future major release. Consider using Overlay.',
      },
    },
  },
} as Meta<typeof PointerBox>

export const Default = () => <PointerBox>Pointer box content</PointerBox>

export const Playground: StoryFn<ComponentProps<typeof PointerBox>> = args => (
  <PointerBox {...args}>Pointer box content</PointerBox>
)
Playground.args = {
  caret: 'top',
}
Playground.argTypes = {
  caret: {
    control: {
      type: 'radio',
    },
    options: [
      'top',
      'top-left',
      'top-right',
      'right',
      'right-top',
      'right-bottom',
      'bottom',
      'bottom-left',
      'bottom-right',
      'left',
      'left-top',
      'left-bottom',
    ],
  },
  bg: {
    control: 'color',
  },
  borderColor: {
    control: 'color',
  },
  border: {
    control: 'number',
  },
}
