import {EyeClosedIcon, EyeIcon, SearchIcon, TriangleDownIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import {Story, Meta} from '@storybook/react'
import React from 'react'
import {Button} from '.'
const unset = undefined
const icons = {unset, EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon}

const actionIcons = {unset, TriangleDownIcon}

export default {
  title: 'Components/Button',
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
    leadingIcon: {
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    trailingIcon: {
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
    trailingVisualCount: {
      control: {
        type: 'number'
      }
    }
  },
  args: {
    block: false,
    size: 'medium',
    disabled: false,
    variant: 'default',
    alignContent: 'center',
    trailingIcon: null,
    leadingIcon: null,
    trailingAction: null,
    trailingVisualCount: undefined
  }
} as Meta<typeof Button>

export const Playground: Story<typeof Button> = args => <Button {...args}>Default</Button>
