import {ActionMenu as PrimerActionMenu} from '@primer/react'
import type {ComponentProps} from 'react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'

// Derive prop types from the underlying Primer components and augment with SxProp
export type ActionMenuProps = ComponentProps<typeof PrimerActionMenu> & SxProp
export type ActionMenuButtonProps = ComponentProps<typeof PrimerActionMenu.Button> & SxProp
export type ActionMenuOverlayProps = ComponentProps<typeof PrimerActionMenu.Overlay> & SxProp

const ActionMenuButton = forwardRef<HTMLButtonElement, ActionMenuButtonProps>((props, ref) => {
  return <Box as={PrimerActionMenu.Button} ref={ref} {...props} />
})

const ActionMenuImpl = (props: ActionMenuProps) => <Box as={PrimerActionMenu} {...props} />

const ActionMenuOverlay = (props: ActionMenuOverlayProps) => {
  return <Box as={PrimerActionMenu.Overlay} {...props} />
}

type ActionMenuComposite = ((props: ActionMenuProps) => JSX.Element) & {
  Button: typeof ActionMenuButton
  Anchor: typeof PrimerActionMenu.Anchor
  Overlay: typeof ActionMenuOverlay
  Divider: typeof PrimerActionMenu.Divider
}

export const ActionMenu: ActionMenuComposite = Object.assign(ActionMenuImpl, {
  Button: ActionMenuButton,
  Anchor: PrimerActionMenu.Anchor,
  Overlay: ActionMenuOverlay,
  Divider: PrimerActionMenu.Divider,
})
