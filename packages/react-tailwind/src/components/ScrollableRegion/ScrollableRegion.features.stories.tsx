import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {ScrollableRegion} from './ScrollableRegion'

const meta = {
  title: 'React Tailwind/Components/ScrollableRegion/Features',
  component: ScrollableRegion,
  args: {'aria-label': 'Scrollable content'},
} satisfies Meta<typeof ScrollableRegion>
export default meta
type Story = StoryObj<typeof meta>

export const HorizontalOverflow: Story = {
  render: () => (
    <ScrollableRegion aria-label="Wide content" className="max-w-64">
      <div className="w-[48rem]">Wide content</div>
    </ScrollableRegion>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('region', {name: 'Wide content'})).toHaveAttribute('tabindex', '0')
  },
}
export const VerticalOverflow: Story = {
  render: () => (
    <ScrollableRegion aria-label="Long content" className="max-h-24">
      <div className="h-48">Long content</div>
    </ScrollableRegion>
  ),
}
