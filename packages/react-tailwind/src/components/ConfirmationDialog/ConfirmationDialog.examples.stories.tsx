import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {ConfirmationDialog} from './ConfirmationDialog'

const meta = {
  title: 'React Tailwind/Components/ConfirmationDialog/Examples',
  component: ConfirmationDialog,
  args: {
    title: 'Delete issue?',
    trigger: <Button>Delete</Button>,
  },
} satisfies Meta<typeof ConfirmationDialog>

export default meta
type Story = StoryObj<typeof meta>

export const DestructiveConfirmation: Story = {
  render: () => (
    <ConfirmationDialog
      dangerous
      description="This action cannot be undone."
      title="Delete issue?"
      trigger={<Button variant="danger">Delete</Button>}
    />
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'Delete'}))
    await expect(within(document.body).findByRole('alertdialog', {name: 'Delete issue?'})).resolves.toBeVisible()
  },
}
