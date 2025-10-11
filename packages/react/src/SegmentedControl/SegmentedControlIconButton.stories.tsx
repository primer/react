import type {Meta, StoryFn} from '@storybook/react-vite'
import type {SegmentedControlIconButtonProps} from './SegmentedControlIconButton'
import SegmentedControlIconButton from './SegmentedControlIconButton'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

const icons = {FileCodeIcon, EyeIcon, PeopleIcon}

export default {
  title: 'Components/SegmentedControl/SegmentedControl.IconButton',
  component: SegmentedControlIconButton,
  args: {
    icon: FileCodeIcon,
    selected: false,
    defaultSelected: false,
    disabled: false,
    'aria-disabled': false,
  },
  argTypes: {
    icon: {
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
    disabled: {
      type: 'boolean',
    },
    'aria-disabled': {
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
} as Meta<typeof SegmentedControlIconButton>

export const Playground: StoryFn<SegmentedControlIconButtonProps> = args => (
  <SegmentedControlIconButton {...args} aria-label="Icon label" />
)
