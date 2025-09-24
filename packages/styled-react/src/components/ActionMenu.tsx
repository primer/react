import {ActionMenu as PrimerActionMenu} from '@primer/react'
import type {ComponentProps} from 'react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'

// Derive prop types from the underlying Primer components and augment with SxProp
export type ActionMenuProps = ComponentProps<typeof PrimerActionMenu> & SxProp
export type ActionMenuButtonProps = ComponentProps<typeof PrimerActionMenu.Button> & SxProp

const ActionMenuButton = forwardRef<HTMLButtonElement, ActionMenuButtonProps>(function ActionMenuButton(props, ref) {
  return <Box as={PrimerActionMenu.Button} ref={ref} {...props} />
})

const ActionMenuImpl = (props: ActionMenuProps) => {
  return <Box as={PrimerActionMenu} {...props} />
}

type ActionMenuComposite = ((props: ActionMenuProps) => JSX.Element) & {
  Button: typeof ActionMenuButton
  Anchor: typeof PrimerActionMenu.Anchor
  Overlay: typeof PrimerActionMenu.Overlay
  Divider: typeof PrimerActionMenu.Divider
}

export const ActionMenu: ActionMenuComposite = Object.assign(ActionMenuImpl, {
  Button: ActionMenuButton,
  Anchor: PrimerActionMenu.Anchor,
  Overlay: PrimerActionMenu.Overlay,
  Divider: PrimerActionMenu.Divider,
})

export {ActionMenuButton}
