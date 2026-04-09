import {ActionMenu as PrimerActionMenu, type SlotMarker} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type {ComponentProps} from 'react'
import type React from 'react'

type ActionMenuOverlayProps = ComponentProps<typeof PrimerActionMenu.Overlay> & SxProp

const ActionMenuOverlay: React.ComponentType<ActionMenuOverlayProps> & SlotMarker = styled(
  PrimerActionMenu.Overlay,
).withConfig({
  shouldForwardProp: prop => (prop as keyof ActionMenuOverlayProps) !== 'sx',
})`
  ${sx}
`
ActionMenuOverlay.__SLOT__ = PrimerActionMenu.Overlay.__SLOT__

// Create a wrapper component to avoid mutating the original PrimerActionMenu
function ActionMenuRoot(props: ComponentProps<typeof PrimerActionMenu>) {
  return <PrimerActionMenu {...props} />
}
ActionMenuRoot.displayName = 'ActionMenu'
;(ActionMenuRoot as typeof ActionMenuRoot & SlotMarker).__SLOT__ = PrimerActionMenu.__SLOT__

export const ActionMenu: typeof PrimerActionMenu & {
  Button: typeof PrimerActionMenu.Button
  Anchor: typeof PrimerActionMenu.Anchor
  Overlay: typeof ActionMenuOverlay
  Divider: typeof PrimerActionMenu.Divider
} = Object.assign(ActionMenuRoot as typeof PrimerActionMenu & SlotMarker, {
  Button: PrimerActionMenu.Button,
  Anchor: PrimerActionMenu.Anchor,
  Overlay: ActionMenuOverlay,
  Divider: PrimerActionMenu.Divider,
})
