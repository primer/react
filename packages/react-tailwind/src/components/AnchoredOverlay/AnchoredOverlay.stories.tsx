import type {Meta, StoryObj} from '@storybook/react-vite'
import {AnchoredOverlay} from './AnchoredOverlay'

const meta = {
  title: 'React Tailwind/Components/AnchoredOverlay',
  component: AnchoredOverlay,
} satisfies Meta<typeof AnchoredOverlay>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger>Open overlay</AnchoredOverlay.Trigger>
      <AnchoredOverlay.Content>Anchored content</AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const Playground: Story = {
  render: () => (
    <AnchoredOverlay modal="trap-focus">
      <AnchoredOverlay.Trigger>Open</AnchoredOverlay.Trigger>
      <AnchoredOverlay.Content>
        <AnchoredOverlay.Close>Close</AnchoredOverlay.Close>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const WithArrow: Story = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger>More</AnchoredOverlay.Trigger>
      <AnchoredOverlay.Content>
        <AnchoredOverlay.Arrow />
        Positioned overlay
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
