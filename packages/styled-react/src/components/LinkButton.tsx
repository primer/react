import {
  LinkButton as PrimerLinkButton,
  type LinkButtonProps as PrimerLinkButtonProps,
  sx,
  type SxProp,
} from '@primer/react'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'

type LinkButtonProps = PrimerLinkButtonProps & SxProp

const LinkButton: ForwardRefComponent<'a', LinkButtonProps> = styled(PrimerLinkButton).withConfig({
  shouldForwardProp: prop => (prop as keyof LinkButtonProps) !== 'sx',
})<LinkButtonProps>`
  ${sx}
`

export {LinkButton}
export type {LinkButtonProps}
