import {ActionMenu as PrimerActionMenu, type SlotMarker} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type {ComponentProps} from 'react'

type ActionMenuOverlayProps = ComponentProps<typeof PrimerActionMenu.Overlay> & SxProp

const ActionMenuOverlay: React.ComponentType<ActionMenuOverlayProps> & SlotMarker = styled(
  PrimerActionMenu.Overlay,
).withConfig({
  shouldForwardProp: prop => (prop as keyof ActionMenuOverlayProps) !== 'sx',
})`
  ${sx}
`

export const ActionMenu: typeof PrimerActionMenu & {
  Button: typeof PrimerActionMenu.Button
  Anchor: typeof PrimerActionMenu.Anchor
  Overlay: typeof ActionMenuOverlay
  Divider: typeof PrimerActionMenu.Divider
} = Object.assign(PrimerActionMenu, {
  Button: PrimerActionMenu.Button,
  Anchor: PrimerActionMenu.Anchor,
  Overlay: ActionMenuOverlay,
  Divider: PrimerActionMenu.Divider,
})

ActionMenuOverlay.__SLOT__ = PrimerActionMenu.Overlay.__SLOT__
