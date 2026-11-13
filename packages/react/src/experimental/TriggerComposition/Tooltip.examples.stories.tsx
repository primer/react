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
    const [tooltipOpen, setTooltipOpen] = useState(false)
    return (
      <ActionMenu
        open={menuOpen}
        onOpenChange={next => {
          setMenuOpen(next)
          if (next) setTooltipOpen(false)
        }}
        renderAnchor={
          <Tooltip
            text="Choose an action"
            open={!menuOpen && tooltipOpen}
            onOpenChange={next => {
              if (!menuOpen) setTooltipOpen(next)
            }}
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
          'The application coordinates two visibility states on one composed trigger, without changing tooltip text, calling native popover methods, or merging refs and handlers. For tooltip-only suppression with the stable component, use its disabled prop instead.',
      },
    },
  },
}
