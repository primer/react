import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {BaseStyles} from '../../BaseStyles'
import type {CSSPropertiesWithCustomProperties} from '../../utils/types'
import {ActionMenu} from '../ActionMenu'
import {Button} from '../Button'
import {Popover} from '../Popover'
import {Dialog} from './Dialog'

const meta = {
  title: 'React Tailwind/Components/Dialog/Examples',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>
const namedPortalStyle: CSSPropertiesWithCustomProperties = {'--portal-test-scope': 'named'}

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
      <Dialog.Content position="right">
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

function NamedPortalExample({compound = false}: {compound?: boolean}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  const [selection, setSelection] = React.useState('No action selected')
  const content = (
    <>
      <Dialog.Header>
        <Dialog.Title>Repository settings</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <ActionMenu>
          <ActionMenu.Button>Repository actions</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item onClick={() => setSelection('Rename selected')}>Rename</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <Popover>
          <Popover.Trigger render={<Button>Open help</Button>} />
          <Popover.Content>
            <Popover.Title>Help</Popover.Title>
            <p>Repository settings help</p>
          </Popover.Content>
        </Popover>
        <Dialog>
          <Dialog.Trigger render={<Button>Open confirmation</Button>} />
          <Dialog.Content>
            <Dialog.Title>Confirm changes</Dialog.Title>
            <Dialog.Close render={<Button>Cancel confirmation</Button>} />
          </Dialog.Content>
        </Dialog>
        <p role="status">{selection}</p>
      </Dialog.Body>
    </>
  )

  return (
    <BaseStyles>
      <div ref={setContainer} data-testid="named-dialog-root" style={namedPortalStyle} />
      <Dialog>
        <Dialog.Trigger render={<Button>Open settings</Button>} />
        {compound ? (
          <Dialog.Portal container={container}>
            <Dialog.Backdrop />
            <Dialog.Viewport>
              <Dialog.Popup>{content}</Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        ) : (
          <Dialog.Content container={container}>{content}</Dialog.Content>
        )}
      </Dialog>
    </BaseStyles>
  )
}

export const NamedPortalWithNestedMenu: Story = {
  render: () => <NamedPortalExample />,
}

export const NamedPortalWithCompoundDialog: Story = {
  render: () => <NamedPortalExample compound />,
}
