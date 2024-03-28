import {ActionBar as Bar, ActionBarIconButton, ActionBarSubMenuButton, VerticalDivider} from './ActionBar'
export type {ActionBarProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  Divider: VerticalDivider,
  SubMenuButton: ActionBarSubMenuButton,
})

export default ActionBar
