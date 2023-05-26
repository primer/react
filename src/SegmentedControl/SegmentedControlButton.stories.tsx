import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import {Meta, StoryFn} from '@storybook/react'
import React from 'react'
import {SegmentedControl} from '.'
import SegmentedControlButton, {SegmentedControlButtonProps} from './SegmentedControlButton'

const unset = undefined
const icons = {unset, FileCodeIcon, EyeIcon, PeopleIcon}

export default {
  title: 'Components/SegmentedControl/SegmentedControl.Button',
  component: SegmentedControlButton,
  args: {
    children: 'Option',
    leadingIcon: undefined,
    selected: false,
    defaultSelected: false,
  },
  argTypes: {
    children: {
      type: 'string',
    },
    leadingIcon: {
      control: 'select',
      options: Object.keys(icons),
      mapping: icons,
    },
    selected: {
      type: 'boolean',
    },
    defaultSelected: {
      type: 'boolean',
    },
  },
  decorators: [
    Story => {
      return (
        <SegmentedControl>
          <Story />
        </SegmentedControl>
      )
    },
  ],
} as Meta<typeof SegmentedControlButton>

export const Playground: StoryFn<SegmentedControlButtonProps> = args => <SegmentedControlButton {...args} />
