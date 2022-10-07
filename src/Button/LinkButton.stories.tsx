import {EyeClosedIcon, EyeIcon, SearchIcon, ChevronRightIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import {Story, Meta} from '@storybook/react'
import React from 'react'
import {Button} from '.'
const unset = undefined
const icons = {unset, EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon}
const actionIcons = {unset, ChevronRightIcon}

export default {
  title: 'Components/LinkButton',
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large']
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: ['default', 'primary', 'danger', 'invisible']
      }
    },
    alignContent: {
      control: {
        type: 'radio',
        options: ['center', 'start']
      }
    },
    block: {
      control: {
        type: 'boolean'
      }
    },
    leadingVisual: {
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    trailingVisual: {
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    trailingAction: {
      control: {
        type: 'select',
        options: Object.keys(actionIcons)
      },
      mapping: actionIcons
    },
    href: {control: 'text'}
  },
  args: {
    block: false,
    size: 'medium',
    variant: 'default',
    alignContent: 'center',
    trailingVisual: null,
    leadingVisual: null,
    href: '/'
  }
} as Meta<typeof Button>

export const Playground: Story<typeof Button> = args => (
  <Button as="a" {...args}>
    Default
  </Button>
)
