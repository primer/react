import type {Meta, StoryObj} from '@storybook/react-vite'
import {ScrollableRegion} from './ScrollableRegion'

const meta = {
  title: 'Components/ScrollableRegion',
  component: ScrollableRegion,
} satisfies Meta<typeof ScrollableRegion>

export default meta

type Story = StoryObj<typeof meta>

const content = (
  <p className="w-[48rem]">
    This long line makes the content overflow horizontally, which gives the container its labelled region semantics.
  </p>
)

export const Default: Story = {
  args: {
    'aria-label': 'Scrollable example',
    children: content,
  },
}

export const Playground: Story = {
  args: {
    'aria-label': 'Scrollable example',
    children: content,
    className: 'max-w-80',
  },
}
