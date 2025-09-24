import {
  IconButton as PrimerIconButton,
  type IconButtonProps as PrimerIconButtonProps,
  sx,
  type SxProp,
} from '@primer/react'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'

type IconButtonProps = PrimerIconButtonProps & SxProp

const IconButton: ForwardRefComponent<'a' | 'button', IconButtonProps> = styled(PrimerIconButton).withConfig({
  shouldForwardProp: prop => (prop as keyof IconButtonProps) !== 'sx',
})<IconButtonProps>`
  ${sx}
`

export {IconButton}
export type {IconButtonProps}
