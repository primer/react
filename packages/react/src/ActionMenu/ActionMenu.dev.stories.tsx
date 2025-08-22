import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {ActionMenu} from './ActionMenu'
import {ActionList} from '../ActionList'

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
