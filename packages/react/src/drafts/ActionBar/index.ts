import {ActionBar as Bar, ActionBarIconButton, ActionBarSubMenu, VerticalDivider} from './ActionBar'
export type {ActionBarProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  SubMenu: ActionBarSubMenu,
  Divider: VerticalDivider,
})

export default ActionBar
