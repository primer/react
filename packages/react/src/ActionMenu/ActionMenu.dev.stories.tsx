import type {Meta} from '@storybook/react-vite'
import {useRef, useState} from 'react'
import type {ComponentProps} from '../utils/types'
import {ActionMenu} from './ActionMenu'
import {ActionList} from '../ActionList'
import {Button} from '../Button'

export default {
  title: 'Components/ActionMenu/Dev',
  component: ActionMenu,
} as Meta<ComponentProps<typeof ActionMenu>>

export const WithCss = () => (
  <ActionMenu>
    <ActionMenu.Button className="testCustomClassnameColor">Open menu</ActionMenu.Button>
    <ActionMenu.Overlay width="medium" className="testCustomClassnameBorder">
      <ActionList>
        <ActionList.Item onSelect={() => alert('Copy link clicked')}>
          Copy link
          <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Quote reply clicked')}>
          Quote reply
          <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Edit comment clicked')}>
          Edit comment
          <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
          Delete file
          <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
)

/**
 * Reproduces a bug where switching the anchor DOM element (via unmount/remount)
 * causes the CSS anchor positioning to break because `anchor-name` is never
 * re-applied to the new element.
 *
 * https://github.com/github/primer/issues/6616
 */
export const AnchorElementReplacement = () => {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [anchorKey, setAnchorKey] = useState(0)

  return (
    <div style={{padding: 40}}>
      <p style={{marginBottom: 8, fontSize: 14, color: '#656d76'}}>
        1. Open the menu below. 2. Click &quot;Switch anchor (remount)&quot; inside the menu. 3. The overlay should
        remain anchored to the button — not jump to the top-left corner.
      </p>

      <Button key={anchorKey} ref={anchorRef} onClick={() => setOpen(o => !o)}>
        Open menu (anchor v{anchorKey})
      </Button>

      <ActionMenu anchorRef={anchorRef} open={open} onOpenChange={setOpen}>
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item
              onSelect={event => {
                // Prevent the menu from closing when clicking this item
                event.preventDefault()
                setAnchorKey(k => k + 1)
              }}
            >
              Switch anchor (remount)
            </ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item>Item one</ActionList.Item>
            <ActionList.Item>Item two</ActionList.Item>
            <ActionList.Item>Item three</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </div>
  )
}
