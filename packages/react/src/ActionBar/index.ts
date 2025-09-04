import {ActionBar as Bar, ActionBarIconButton, VerticalDivider, ActionBarContext} from './ActionBar'
export type {ActionBarProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  Divider: VerticalDivider,
})

export default ActionBar
export {ActionBar, ActionBarContext}
