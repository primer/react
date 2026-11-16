import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {Button} from '../Button'
import {ActionMenu} from '../ActionMenu'
import {ConfirmationDialog} from './ConfirmationDialog'

const meta = {
  title: 'React Tailwind/Components/ConfirmationDialog/Features',
  component: ConfirmationDialog,
} satisfies Meta<typeof ConfirmationDialog>

export default meta
type Story = StoryObj

export const ShorthandHook: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [confirmed, setConfirmed] = React.useState(false)
    return (
      <>
        <div className="flex flex-col items-start">
          {Array.from({length: 4}, (_, index) => (
            <Button className="mb-2" key={index} onClick={() => setOpen(true)}>
              {confirmed ? "I'm green!" : 'Turn me green!'}
            </Button>
          ))}
        </div>
        <ConfirmationDialog
          open={open}
          onOpenChange={setOpen}
          title="Are you sure?"
          description="Do you really want to turn this button green?"
          onConfirm={() => setConfirmed(true)}
        />
      </>
    )
  },
}

export const ShorthandHookFromActionMenu: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [text, setText] = React.useState('open me')
    return (
      <>
        <ActionMenu>
          <ActionMenu.Button>{text}</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item onClick={() => setOpen(true)}>Do a trick!</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <ConfirmationDialog
          open={open}
          onOpenChange={setOpen}
          title="Are you sure?"
          onConfirm={() => setText('tada!')}
        />
      </>
    )
  },
}

export const LoadingStates: Story = {
  render: () => (
    <ConfirmationDialog
      dangerous
      title="Delete this file?"
      description="This action cannot be undone. The file will be permanently deleted from your repository."
      confirmButtonContent="Delete"
      trigger={<Button>Show Loading Dialog</Button>}
    />
  ),
}

export const LongTitleAndActions: Story = {
  render: () => (
    <ConfirmationDialog
      title={<span lang="de">Repositoryzugriffsberechtigungsprüfung</span>}
      description="Review the repository access settings before continuing."
      confirmButtonContent={<span lang="de">Repositoryzugriffsberechtigung überprüfen</span>}
      trigger={<Button>Show confirmation</Button>}
    />
  ),
}
