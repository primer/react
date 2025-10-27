<<<<<<< HEAD
import {
  ActionBar as Bar,
  ActionBarIconButton,
  VerticalDivider,
  ActionBarGroup,
  ActionBarMenu,
  ActionBarMenuItem,
} from './ActionBar'
=======
import {ActionBar as Bar, ActionBarIconButton, VerticalDivider, ActionBarGroup} from './ActionBar'
>>>>>>> main
export type {ActionBarProps} from './ActionBar'

const ActionBar = Object.assign(Bar, {
  IconButton: ActionBarIconButton,
  Divider: VerticalDivider,
  Group: ActionBarGroup,
<<<<<<< HEAD
  Menu: ActionBarMenu,
  MenuItem: ActionBarMenuItem,
=======
>>>>>>> main
})

export default ActionBar
export {ActionBar}
