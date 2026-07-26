import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {Dialog} from './Dialog'

const meta = {
  title: 'React Tailwind/Components/Dialog/Examples',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const ControlledDialog: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>Open example dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Example dialog</Dialog.Title>
        <Dialog.Description>Dialog content</Dialog.Description>
        <Dialog.Close render={<Button>Close</Button>} />
      </Dialog.Content>
    </Dialog>
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'Open example dialog'}))
    await expect(within(document.body).findByRole('dialog', {name: 'Example dialog'})).resolves.toBeVisible()
  },
}

export const SideSheetInteraction: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Open side sheet</Button>} />
      <Dialog.Content className="h-full max-w-[640px] rounded-none" viewportClassName="items-stretch justify-end p-0">
        <Dialog.Header>
          <Dialog.Title>Side sheet</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>Side-sheet content</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button>Done</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'Open side sheet'}))
    await expect(within(document.body).findByRole('dialog', {name: 'Side sheet'})).resolves.toBeVisible()
  },
}
