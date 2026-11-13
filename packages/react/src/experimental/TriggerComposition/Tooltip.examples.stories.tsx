import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionList} from '../../ActionList'
import {Button} from '../../Button'
import {ActionMenu, Tooltip} from './TriggerComposition'

const meta = {
  title: 'Experimental/Components/Tooltip/Examples',
  component: Tooltip,
  args: {text: 'Choose an action'},
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const CoordinateWithMenu: Story = {
  render: function CoordinateWithMenu() {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
      <ActionMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        renderAnchor={
          <Tooltip
            text="Choose an action"
            disabled={menuOpen}
            popupProps={{id: 'action-tooltip'}}
            renderAnchor={<Button>Actions</Button>}
          />
        }
      >
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item>Edit</ActionList.Item>
            <ActionList.Item>Duplicate</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the menu state to suppress its tooltip with disabled, without a second visibility state or private API. The composed trigger stays enabled, its accessible description is preserved, and refs and handlers merge automatically.',
      },
    },
  },
}
