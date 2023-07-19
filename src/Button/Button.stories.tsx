import React from 'react'
import {EyeClosedIcon, EyeIcon, SearchIcon, TriangleDownIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react'
import {Button} from '.'
import {OcticonArgType} from '../utils/story-helpers'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
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
    variant: {
      control: {
        type: 'radio',
      },
      options: ['default', 'primary', 'danger', 'invisible', 'outline'],
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
    leadingVisual: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
    trailingVisual: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
    trailingAction: OcticonArgType([TriangleDownIcon]),
    count: {
      control: {
        type: 'number',
      },
    },
  },
  args: {
    block: false,
    size: 'medium',
    disabled: false,
    variant: 'default',
    alignContent: 'center',
    trailingVisual: null,
    leadingVisual: null,
    trailingAction: null,
    count: undefined,
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Playground: Story = {
  render: args => <Button {...args}>Button</Button>,
}

export const Default = () => <Button>Default</Button>
