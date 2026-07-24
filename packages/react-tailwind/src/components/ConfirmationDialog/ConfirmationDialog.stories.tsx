import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {ConfirmationDialog} from './ConfirmationDialog'

const meta = {
  title: 'React Tailwind/Components/ConfirmationDialog',
  component: ConfirmationDialog,
  args: {
    title: 'Discard changes?',
    trigger: <Button>Discard</Button>,
  },
} satisfies Meta<typeof ConfirmationDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ConfirmationDialog
      title="Discard changes?"
      description="Your unsaved changes will be lost."
      trigger={<Button>Discard</Button>}
    />
  ),
}
export const Playground: Story = {
  render: () => (
    <ConfirmationDialog
      dangerous
      title="Delete repository?"
      description="This action cannot be undone."
      trigger={<Button variant="danger">Delete</Button>}
    />
  ),
}
export const LoadingConfirmation: Story = {
  render: () => <ConfirmationDialog confirmButtonLoading title="Continue?" trigger={<Button>Continue</Button>} />,
}
