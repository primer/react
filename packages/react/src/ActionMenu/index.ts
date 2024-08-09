import {Menu as ActionMenuImpl, MenuButton, Anchor, Overlay} from './ActionMenu'
import {Divider} from '../ActionList/Divider'

import type {
  ActionMenuProps,
  MenuCloseHandler,
  MenuContextProps,
  ActionMenuAnchorProps,
  ActionMenuButtonProps,
} from './ActionMenu'

export const ActionMenu = Object.assign(ActionMenuImpl, {Button: MenuButton, Anchor, Overlay, Divider})

export type {ActionMenuProps, MenuCloseHandler, MenuContextProps, ActionMenuAnchorProps, ActionMenuButtonProps}
