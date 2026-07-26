import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SegmentedControl} from './SegmentedControl'
const meta = {
  title: 'React Tailwind/Forms/SegmentedControl',
  component: SegmentedControl,
  args: {fullWidth: false, size: 'medium'},
  argTypes: {
    size: {control: 'radio', options: ['small', 'medium']},
  },
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
export const Playground: Story = {
  render: args => (
    <SegmentedControl aria-label="File view" defaultValue={['preview']} fullWidth={args.fullWidth} size={args.size}>
      <SegmentedControl.Button value="preview" leadingVisual={<EyeIcon aria-hidden="true" />}>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button value="raw" leadingVisual={<FileCodeIcon aria-hidden="true" />}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" leadingVisual={<PeopleIcon aria-hidden="true" />}>
        Blame
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
