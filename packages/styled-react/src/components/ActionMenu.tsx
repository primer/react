import {ActionMenu as PrimerActionMenu, type SxProp} from '@primer/react'
import {sx} from '../sx'
import styled from 'styled-components'
import type {ComponentProps} from 'react'

type ActionMenuOverlayProps = ComponentProps<typeof PrimerActionMenu.Overlay> & SxProp

const ActionMenuOverlay: React.ComponentType<ActionMenuOverlayProps> = styled(PrimerActionMenu.Overlay).withConfig({
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

// @ts-ignore -- TS doesn't know about the __SLOT__ property
PrimerActionMenu.__SLOT__ = PrimerActionMenu.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
ActionMenuOverlay.__SLOT__ = PrimerActionMenu.Overlay.__SLOT__
