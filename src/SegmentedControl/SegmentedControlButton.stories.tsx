import React from 'react'
import {Story, Meta} from '@storybook/react'
import SegmentedControlButton, {SegmentedControlButtonProps} from './SegmentedControlButton'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

const unset = undefined
const icons = {unset, FileCodeIcon, EyeIcon, PeopleIcon}

export default {
  title: 'Components/SegmentedControl/SegmentedControl.Button',
  component: SegmentedControlButton,
  args: {
    children: 'Option',
    leadingIcon: null,
    selected: false,
    defaultSelected: false
  },
  argTypes: {
    children: {
      type: 'string'
    },
    leadingIcon: {
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
} as Meta<typeof SegmentedControlButton>

export const Playground: Story<SegmentedControlButtonProps> = args => <SegmentedControlButton {...args} />
