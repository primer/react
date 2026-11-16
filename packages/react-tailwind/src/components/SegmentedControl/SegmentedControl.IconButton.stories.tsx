import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SegmentedControl, type SegmentedControlIconButtonProps} from './SegmentedControl'

const icons = {FileCodeIcon, EyeIcon, PeopleIcon}

const meta = {
  title: 'React Tailwind/Forms/SegmentedControl.IconButton',
  component: SegmentedControl.IconButton,
  args: {'aria-label': 'Icon label', disabled: false, icon: FileCodeIcon, value: 'option'},
  argTypes: {
    icon: {control: 'select', options: Object.keys(icons), mapping: icons},
    description: {control: 'text'},
    disabled: {control: 'boolean'},
  },
  decorators: [
    Story => (
      <SegmentedControl aria-label="Options">
        <Story />
      </SegmentedControl>
    ),
  ],
} satisfies Meta<SegmentedControlIconButtonProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
