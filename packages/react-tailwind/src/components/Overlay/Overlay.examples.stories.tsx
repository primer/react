import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, within} from 'storybook/test'
import {ActionMenu} from '../ActionMenu'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {Popover} from '../Popover'
import {Overlay} from './Overlay'

const meta = {
  title: 'React Tailwind/Components/Overlay/Examples',
  component: Overlay,
} satisfies Meta<typeof Overlay>

export default meta
type Story = StoryObj<typeof meta>

export const ControlledDialog: Story = {
  render: () => (
    <Overlay aria-label="Example overlay" className="w-80 p-4" role="dialog">
      Controlled overlay content
    </Overlay>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('dialog', {name: 'Example overlay'})).toBeVisible()
  },
}

export const PortaledChildren: Story = {
  render: function PortaledChildrenExample() {
    const [lastAction, setLastAction] = useState('none')
    return (
      <>
        <Button>Outside overlay</Button>
        <Popover>
          <Popover.Trigger render={<Button>Open overlay</Button>} />
          <Popover.Portal>
            <Popover.Positioner sideOffset={8}>
              <Popover.Popup aria-label="Repository overlay" render={<Overlay className="relative w-80 p-4" />}>
                <div className="flex flex-col items-start gap-2">
                  <ActionMenu>
                    <ActionMenu.Button>File actions</ActionMenu.Button>
                    <ActionMenu.Content>
                      <ActionMenu.Item onClick={() => setLastAction('Copy path')}>Copy path</ActionMenu.Item>
                    </ActionMenu.Content>
                  </ActionMenu>
                  <Popover>
                    <Popover.Trigger render={<Button>Nested popover</Button>} />
                    <Popover.Content aria-label="Nested settings">
                      <Button onClick={() => setLastAction('Apply settings')}>Apply settings</Button>
                    </Popover.Content>
                  </Popover>
                  <Dialog>
                    <Dialog.Trigger render={<Button>Nested dialog</Button>} />
                    <Dialog.Content width="small">
                      <Dialog.Header>
                        <Dialog.Title>Confirm changes</Dialog.Title>
                        <Dialog.CloseButton />
                      </Dialog.Header>
                      <Dialog.Body>
                        <Button onClick={() => setLastAction('Confirm changes')}>Confirm changes</Button>
                      </Dialog.Body>
                    </Dialog.Content>
                  </Dialog>
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover>
        <p role="status">Last action: {lastAction}</p>
      </>
    )
  },
}
