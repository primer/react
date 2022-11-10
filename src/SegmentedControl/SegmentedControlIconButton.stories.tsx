import React from 'react'
import {Story, Meta} from '@storybook/react'
import SegmentedControlIconButton, {SegmentedControlIconButtonProps} from './SegmentedControlIconButton'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

const unset = undefined
const icons = {unset, FileCodeIcon, EyeIcon, PeopleIcon}

export default {
  title: 'Components/SegmentedControl/SegmentedControl.IconButton',
  component: SegmentedControlIconButton,
  args: {
    icon: 'FileCodeIcon',
    selected: false,
    defaultSelected: false
  },
  argTypes: {
    icon: {
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    selected: {
      type: 'boolean'
    },
    defaultSelected: {
      type: 'boolean'
    }
  },
  decorators: [
    Story => {
      return (
        <SegmentedControl>
          <Story />
        </SegmentedControl>
      )
    }
  ]
} as Meta<typeof SegmentedControlIconButton>

export const Playground: Story<SegmentedControlIconButtonProps> = args => (
  <SegmentedControlIconButton {...args} aria-label="test" />
)
