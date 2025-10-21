import {LinkButton as PrimerLinkButton, type LinkButtonProps as PrimerLinkButtonProps} from '@primer/react'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'
import {sx, type SxProp} from '../sx'

type LinkButtonProps = PrimerLinkButtonProps & SxProp

const LinkButton: ForwardRefComponent<'a', LinkButtonProps> = styled(PrimerLinkButton).withConfig({
  shouldForwardProp: prop => (prop as keyof LinkButtonProps) !== 'sx',
})<LinkButtonProps>`
  ${sx}
`

export {LinkButton}
export type {LinkButtonProps}
