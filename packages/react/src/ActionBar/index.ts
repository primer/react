import {ActionBar as Bar, ActionBarIconButton, VerticalDivider, ActionBarGroup} from './ActionBar'
export type {ActionBarProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  Divider: VerticalDivider,
  Group: ActionBarGroup,
})

export default ActionBar
export {ActionBar}
