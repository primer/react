import {ActionBar as Bar, ActionBarIconButton, VerticalDivider} from './ActionBar'
export type {ActionBarProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  Divider: VerticalDivider,
})

export default ActionBar
export {ActionBar}
