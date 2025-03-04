import {ActionBar as Bar, ActionBarIconButton, ActionBarMenu, VerticalDivider} from './ActionBar'
export type {ActionBarProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  Menu: ActionBarMenu,
  Divider: VerticalDivider,
})

export default ActionBar
export {ActionBar}
