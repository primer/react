/** This is the place where we keep components that are deprecated.
 *  We don't recommend using it in production.
 *  If you already use them, please move to the suggested alternative components
 *
 *  But, they are published on npm and you can import them.
 *  example: import {FormGroup} from '@primer/react/deprecated
 */

// Deprecated in v35.0.0 on March 9, 2022
// TODO: We can remove these 6 months after release: September 10, 2022
export {default as Label} from './Label'
export type {LabelProps} from './Label'
export {ActionList} from './ActionList'
export type {ActionListProps} from './ActionList'
export {ActionMenu} from './ActionMenu'
export type {ActionMenuProps} from './ActionMenu'
export {DropdownButton, DropdownMenu} from './DropdownMenu'
// (copied over from src/index) not exporting new DropdownMenu types yet due to conflict with Dropdown types above
// export type {DropdownButtonProps, DropdownMenuProps} from './DropdownMenu'
export {
  default as Button,
  ButtonDanger,
  ButtonOutline,
  ButtonPrimary,
  ButtonInvisible,
  ButtonTableList,
  ButtonClose,
} from './Button'
export type {
  ButtonProps,
  ButtonDangerProps,
  ButtonOutlineProps,
  ButtonPrimaryProps,
  ButtonInvisibleProps,
  ButtonTableListProps,
  ButtonCloseProps,
} from './Button'
// end of v35.0.0
