import {Overlay as PrimerOverlay, type OverlayProps as PrimerOverlayProps, sx, type SxProp} from '@primer/react'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'

type OverlayProps = PrimerOverlayProps & SxProp

const Overlay: ForwardRefComponent<'div', OverlayProps> = styled(PrimerOverlay).withConfig({
  shouldForwardProp: prop => (prop as keyof OverlayProps) !== 'sx',
})<OverlayProps>`
  ${sx}
`

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Overlay.__SLOT__ = PrimerOverlay.__SLOT__

export {Overlay}
export type {OverlayProps}
