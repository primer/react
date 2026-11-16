import {
  ActionBar as Bar,
  ActionBarIconButton,
  ActionBarButton,
  VerticalDivider,
  ActionBarGroup,
  ActionBarMenu,
} from './ActionBar'
export type {ActionBarProps, ActionBarButtonProps, ActionBarMenuProps, ActionBarMenuItemProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  Button: ActionBarButton,
  Divider: VerticalDivider,
  Group: ActionBarGroup,
  Menu: ActionBarMenu,
})

export default ActionBar
export {ActionBar}
