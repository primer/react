import React from 'react'
import {EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import {Story, Meta} from '@storybook/react'
import {Button} from '.'
import {OcticonArgType} from '../utils/story-helpers'

export default {
  title: 'Components/LinkButton',
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large'],
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
    href: {control: 'text'},
  },
  args: {
    size: 'medium',
    variant: 'default',
    trailingIcon: null,
    leadingIcon: null,
    href: '/',
  },
} as Meta<typeof Button>

export const Playground: Story<typeof Button> = args => (
  <Button as="a" {...args}>
    Default
  </Button>
)
