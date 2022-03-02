/** This is the place where we keep components that are deprecated.
 *  We don't recommend using it in production.
 *  If you already use them, please move to the suggested alternative components
 *
 *  But, they are published on npm and you can import them.
 *  example: import {FormGroup} from '@primer/react/deprecated
 */

export {default as BorderBox} from './BorderBox'
export type {BorderBoxProps} from './BorderBox'
export {default as ChoiceFieldset, Item} from './ChoiceFieldset'
export {default as ChoiceInputField} from './ChoiceInputField'
export {default as Flex} from './Flex'
export type {FlexProps} from './Flex'
export {default as Grid} from './Grid'
export type {GridProps} from './Grid'
export {default as Position, Absolute, Fixed, Relative, Sticky} from './Position'
export type {PositionProps, AbsoluteProps, FixedProps, RelativeProps, StickyProps} from './Position'
export {default as Dropdown} from './Dropdown'
export type {
  DropdownProps,
  DropdownCaretProps,
  DropdownButtonProps,
  DropdownItemProps,
  DropdownMenuProps
} from './Dropdown'
export {default as FormGroup} from './FormGroup'
export type {FormGroupProps, FormGroupLabelProps} from './FormGroup'
export {default as InputField} from './InputField'
export {default as Label} from './Label'
export type {LabelProps} from './Label'
export {default as SelectMenu} from './SelectMenu'
export type {
  SelectMenuProps,
  SelectMenuDividerProps,
  SelectMenuFilterProps,
  SelectMenuFooterProps,
  SelectMenuItemProps,
  SelectMenuListProps,
  SelectMenuModalProps,
  SelectMenuTabsProps,
  SelectMenuHeaderProps,
  SelectMenuTabProps,
  SelectMenuTabPanelProps,
  SelectMenuLoadingAnimationProps
} from './SelectMenu'
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
  ButtonClose
} from './Button'
export type {
  ButtonProps,
  ButtonDangerProps,
  ButtonOutlineProps,
  ButtonPrimaryProps,
  ButtonInvisibleProps,
  ButtonTableListProps,
  ButtonCloseProps
} from './Button'
