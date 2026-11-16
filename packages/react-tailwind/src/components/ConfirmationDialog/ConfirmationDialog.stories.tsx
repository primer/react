import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {ConfirmationDialog} from './ConfirmationDialog'

const meta = {
  title: 'React Tailwind/Components/ConfirmationDialog',
  component: ConfirmationDialog,
  args: {
    title: 'Delete universe?',
    trigger: <Button>Show dialog</Button>,
  },
} satisfies Meta<typeof ConfirmationDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ConfirmationDialog
      title="Delete universe?"
      dangerous
      confirmButtonContent="Delete it!"
      trigger={<Button>Show dialog</Button>}
    >
      Deleting the universe could have disastrous effects, including but not limited to destroying all life on Earth.
    </ConfirmationDialog>
  ),
}
export const Playground: Story = {
  render: () => (
    <ConfirmationDialog
      dangerous
      title="Delete universe?"
      confirmButtonContent="Delete it!"
      trigger={<Button>Show dialog</Button>}
    >
      Deleting the universe could have disastrous effects, including but not limited to destroying all life on Earth.
    </ConfirmationDialog>
  ),
}
export const LoadingConfirmation: Story = {
  render: () => <ConfirmationDialog confirmButtonLoading title="Continue?" trigger={<Button>Continue</Button>} />,
}
