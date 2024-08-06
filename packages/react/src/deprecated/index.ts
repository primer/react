/** This is the place where we keep components that are deprecated.
 *  We don't recommend using it in production.
 *  If you already use them, please move to the suggested alternative components
 *
 *  But, they are published on npm and you can import them.
 *  example: import {FormGroup} from '@primer/react/deprecated
 */

'use client'

// Deprecated in v35.0.0 on March 9, 2022
// TODO: We can remove these 6 months after release: September 10, 2022
export {ActionList} from './ActionList'
export type {ActionListProps} from './ActionList'
export {ActionMenu} from './ActionMenu'
export type {ActionMenuProps} from './ActionMenu'
// (copied over from src/index) not exporting new DropdownMenu types yet due to conflict with Dropdown types above
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

// Deprecated in v36.0.0
export {default as FilterList} from './FilterList'
export type {FilterListProps, FilterListItemProps} from './FilterList'
export {default as FilteredSearch} from './FilteredSearch'
export type {FilteredSearchProps} from './FilteredSearch'
export {default as UnderlineNav} from './UnderlineNav'
export type {UnderlineNavProps, UnderlineNavLinkProps} from './UnderlineNav'
// end of v36.0.0

// Deprecated in v37.0.0
export {default as Dialog} from '../Dialog'
export type {DialogProps, DialogHeaderProps} from '../Dialog'
export {default as Octicon} from '../Octicon'
export type {OcticonProps} from '../Octicon'
export {default as Pagehead} from '../Pagehead'
export type {PageheadProps} from '../Pagehead'
export {default as TabNav} from '../TabNav'
export type {TabNavProps, TabNavLinkProps} from '../TabNav'
export {default as Tooltip} from '../Tooltip/Tooltip'
export type {TooltipProps} from '../Tooltip/Tooltip'
// end of v37.0.0
