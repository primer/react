import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SegmentedControl, type SegmentedControlButtonProps} from './SegmentedControl'

const icons = {unset: undefined, FileCodeIcon, EyeIcon, PeopleIcon}

const meta = {
  title: 'React Tailwind/Forms/SegmentedControl.Button',
  component: SegmentedControl.Button,
  decorators: [
    Story => (
      <SegmentedControl aria-label="Options">
        <Story />
      </SegmentedControl>
    ),
  ],
} satisfies Meta<SegmentedControlButtonProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {children: 'Option', leadingVisual: undefined, value: 'option'},
  argTypes: {
    children: {control: 'text'},
    leadingVisual: {control: 'select', options: Object.keys(icons), mapping: icons},
    count: {control: 'number'},
    disabled: {control: 'boolean'},
  },
}
