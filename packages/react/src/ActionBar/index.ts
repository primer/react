import {ActionBar as Bar, ActionBarIconButton, VerticalDivider, ActionBarGroup, ActionBarMenu} from './ActionBar'
export type {ActionBarProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  Divider: VerticalDivider,
  Group: ActionBarGroup,
  Menu: ActionBarMenu,
})

export default ActionBar
export {ActionBar}
