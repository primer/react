import React from 'react'
import {EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import {Story, Meta} from '@storybook/react'
import {Button} from '.'
import {OcticonArgType} from '../utils/story-helpers'

export default {
  title: 'Components/Button',
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
        options: ['default', 'primary', 'danger', 'invisible', 'outline'],
      },
    },
    leadingIcon: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
    trailingIcon: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
  },
  args: {
    size: 'medium',
    disabled: false,
    variant: 'default',
    trailingIcon: null,
    leadingIcon: null,
  },
} as Meta<typeof Button>

export const Playground: Story<typeof Button> = args => <Button {...args}>Default</Button>

export const Default = () => <Button>Default</Button>
