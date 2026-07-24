import type {Meta, StoryObj} from '@storybook/react-vite'
import {SegmentedControl} from './SegmentedControl'
const meta = {
  title: 'React Tailwind/Forms/SegmentedControl',
  component: SegmentedControl,
} satisfies Meta<typeof SegmentedControl>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <SegmentedControl defaultValue={['preview']} aria-label="File view">
      <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
      <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
      <SegmentedControl.Button value="blame">Blame</SegmentedControl.Button>
    </SegmentedControl>
  ),
}
export const Playground: Story = {args: {disabled: false}}
