import {Overlay as PrimerOverlay, type OverlayProps as PrimerOverlayProps} from '@primer/react'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'
import {sx, type SxProp} from '../sx'

type OverlayProps = PrimerOverlayProps & SxProp

const Overlay: ForwardRefComponent<'div', OverlayProps> = styled(PrimerOverlay).withConfig({
  shouldForwardProp: prop => (prop as keyof OverlayProps) !== 'sx',
})<OverlayProps>`
  ${sx}
`

export {Overlay}
export type {OverlayProps}
