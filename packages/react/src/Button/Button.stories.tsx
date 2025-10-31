import {EyeClosedIcon, EyeIcon, SearchIcon, TriangleDownIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '.'
import {OcticonArgType} from '../utils/story-helpers'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
} as Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const Playground: Story = {
  render: args => <Button {...args}>Button</Button>,
}
Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  'aria-disabled': {
    control: {
      type: 'boolean',
    },
  },
  inactive: {
    control: {
      type: 'boolean',
    },
  },
  variant: {
    control: {
      type: 'radio',
    },
    options: ['default', 'primary', 'danger', 'invisible', 'link'],
  },
  alignContent: {
    control: {
      type: 'radio',
    },
    options: ['center', 'start'],
  },
  block: {
    control: {
      type: 'boolean',
    },
  },
  loading: {
    control: {
      type: 'boolean',
    },
  },
  labelWrap: {
    control: {
      type: 'boolean',
    },
  },
  count: {
    control: {
      type: 'number',
    },
  },
  keybindingHint: {
    control: {
      type: 'text',
    },
  },
  leadingVisual: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
  trailingVisual: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
  trailingAction: OcticonArgType([TriangleDownIcon]),
}
Playground.args = {
  block: false,
  size: 'medium',
  disabled: false,
  inactive: false,
  variant: 'default',
  alignContent: 'center',
  loading: false,
  trailingVisual: null,
  leadingVisual: null,
  trailingAction: null,
  labelWrap: false,
  'aria-disabled': false,
}

export const Default = () => <Button>Default</Button>
