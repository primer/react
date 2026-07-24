import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Dialog} from './Dialog'

const meta = {
  title: 'React Tailwind/Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

const content = (
  <>
    <Dialog.Header>
      <Dialog.Title>Dialog title</Dialog.Title>
      <Dialog.CloseButton />
    </Dialog.Header>
    <Dialog.Body>
      <Dialog.Description>Dialog description and content.</Dialog.Description>
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button>Done</Button>} />
    </Dialog.Footer>
  </>
)

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Content>{content}</Dialog.Content>
    </Dialog>
  ),
}
export const Playground: Story = {
  render: () => (
    <Dialog modal="trap-focus">
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Content>{content}</Dialog.Content>
    </Dialog>
  ),
}
export const NonModal: Story = {
  render: () => (
    <Dialog modal={false}>
      <Dialog.Trigger>Open non-modal dialog</Dialog.Trigger>
      <Dialog.Content>{content}</Dialog.Content>
    </Dialog>
  ),
}
