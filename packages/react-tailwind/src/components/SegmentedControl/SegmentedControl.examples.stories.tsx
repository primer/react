import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SegmentedControl} from './SegmentedControl'

const meta = {title: 'React Tailwind/Forms/SegmentedControl/Examples', component: SegmentedControl} satisfies Meta<
  typeof SegmentedControl
>
export default meta
type Story = StoryObj<typeof meta>

export const WithDisabledButtons: Story = {
  render: () => (
    <SegmentedControl defaultValue={['preview']} aria-label="File view">
      <SegmentedControl.Button value="preview" leadingVisual={<EyeIcon aria-hidden="true" />} disabled>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button value="raw" leadingVisual={<FileCodeIcon aria-hidden="true" />}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" leadingVisual={<PeopleIcon aria-hidden="true" />} disabled>
        Blame
      </SegmentedControl.Button>
    </SegmentedControl>
  ),
}
