import {Button} from '../Button'
import {ConfirmationDialog} from './ConfirmationDialog'

export default {component: ConfirmationDialog, title: 'Components/ConfirmationDialog'}

export const Default = {
  render: () => (
    <ConfirmationDialog
      title="Discard changes?"
      description="Your unsaved changes will be lost."
      trigger={<Button>Discard</Button>}
    />
  ),
}
export const Playground = {
  render: () => (
    <ConfirmationDialog
      dangerous
      title="Delete repository?"
      description="This action cannot be undone."
      trigger={<Button variant="danger">Delete</Button>}
    />
  ),
}
export const LoadingConfirmation = {
  render: () => <ConfirmationDialog confirmButtonLoading title="Continue?" trigger={<Button>Continue</Button>} />,
}
