import {Button} from '../Button'
import {Dialog} from './Dialog'

export default {component: Dialog, title: 'Components/Dialog'}

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

export const Default = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Content>{content}</Dialog.Content>
    </Dialog>
  ),
}
export const Playground = {
  render: () => (
    <Dialog modal="trap-focus">
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Content>{content}</Dialog.Content>
    </Dialog>
  ),
}
export const NonModal = {
  render: () => (
    <Dialog modal={false}>
      <Dialog.Trigger>Open non-modal dialog</Dialog.Trigger>
      <Dialog.Content>{content}</Dialog.Content>
    </Dialog>
  ),
}
