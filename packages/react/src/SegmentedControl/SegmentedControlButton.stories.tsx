import type {Meta, StoryFn} from '@storybook/react-vite'
import type {SegmentedControlButtonProps} from './SegmentedControlButton'
import SegmentedControlButton from './SegmentedControlButton'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

const unset = undefined
const icons = {unset, FileCodeIcon, EyeIcon, PeopleIcon}

export default {
  title: 'Components/SegmentedControl/SegmentedControl.Button',
  component: SegmentedControlButton,
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
Playground.args = {
  children: 'Option',
  leadingVisual: undefined,
  selected: false,
  defaultSelected: false,
}
Playground.argTypes = {
  children: {
    type: 'string',
  },
  leadingVisual: {
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
  count: {
    type: 'number',
  },
}
