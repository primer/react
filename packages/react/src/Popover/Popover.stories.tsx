import type {Meta, StoryFn} from '@storybook/react-vite'
import Heading from '../Heading'
import Popover, {type PopoverProps, type PopoverContentProps} from './Popover'
import Text from '../Text'
import {Button} from '../Button'

export default {
  title: 'Components/Popover',
  component: Popover,
} as Meta<typeof Popover>

export const Default = () => (
  <Popover relative open={true} caret="top">
    <Popover.Content sx={{marginTop: 2}}>
      <Heading sx={{fontSize: 2}}>Popover heading</Heading>
      <Text as="p">Message about popovers</Text>
      <Button>Got it!</Button>
    </Popover.Content>
  </Popover>
)

export const Playground: StoryFn<PopoverProps & PopoverContentProps> = args => (
  <Popover {...args}>
    <Popover.Content sx={{marginTop: 2}} width={args.width || 'small'} height={args.height}>
      <Heading sx={{fontSize: 2}}>Popover heading</Heading>
      <Text as="p">Message about popovers</Text>
      <Button>Got it!</Button>
    </Popover.Content>
  </Popover>
)

Playground.args = {
  caret: 'top',
  open: true,
  relative: true,
  width: 'small',
  height: 'fit-content',
}

Playground.argTypes = {
  caret: {
    control: {
      type: 'radio',
    },
    options: [
      'top',
      'bottom',
      'left',
      'right',
      'bottom-left',
      'bottom-right',
      'top-left',
      'top-right',
      'left-bottom',
      'left-top',
      'right-bottom',
      'right-top',
    ],
  },
  open: {
    control: {
      type: 'boolean',
    },
  },
  relative: {
    control: {
      type: 'boolean',
    },
  },
  width: {
    control: {
      type: 'radio',
    },
    options: ['xsmall', 'small', 'medium', 'large', 'auto', 'xlarge'],
  },
  height: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large', 'auto', 'xlarge', 'fit-content'],
  },
}
