import {EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import {Story, Meta} from '@storybook/react'
import React from 'react'
import {IconButton} from '.'

const unset = undefined
const icons = {unset, EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon}

export default {
  title: 'Components/IconButton',
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large']
      }
    },
    disabled: {
      control: {
        type: 'boolean'
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: ['default', 'primary', 'danger', 'invisible', 'outline']
      }
    },
    icon: {
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    ariaLabel: {control: 'text'}
  },
  args: {
    size: 'medium',
    disabled: false,
    variant: 'default',
    ariaLabel: 'Icon button description',
    icon: XIcon
  }
} as Meta<typeof IconButton>

export const Playground: Story<typeof IconButton> = args => <IconButton aria-label={args.ariaLabel} {...args} />
