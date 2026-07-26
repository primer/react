import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {AnchoredOverlay} from './AnchoredOverlay'

const meta = {
  title: 'React Tailwind/Components/AnchoredOverlay/Examples',
  component: AnchoredOverlay,
} satisfies Meta<typeof AnchoredOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const ControlledMenu: Story = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger>Actions</AnchoredOverlay.Trigger>
      <AnchoredOverlay.Content role="menu">
        <AnchoredOverlay.Title>Actions</AnchoredOverlay.Title>
        <button type="button">Edit</button>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'Actions'}))
    await expect(within(document.body).findByRole('menu')).resolves.toBeVisible()
  },
}

export const FocusTrap: Story = {
  render: () => (
    <AnchoredOverlay modal="trap-focus">
      <AnchoredOverlay.Trigger render={<Button>Open focus trap</Button>} />
      <AnchoredOverlay.Content role="dialog">
        <AnchoredOverlay.Title>Focus trap</AnchoredOverlay.Title>
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'Open focus trap'}))
    await expect(within(document.body).findByRole('button', {name: 'First action'})).resolves.toHaveFocus()
  },
}
