import {Token as PrimerToken, type TokenProps as PrimerTokenProps, sx, type SxProp} from '@primer/react'
import styled from 'styled-components'
import type {PropsWithChildren} from 'react'
import {type ForwardRefComponent} from '../polymorphic'

type TokenProps = PropsWithChildren<PrimerTokenProps> & SxProp

const Token: ForwardRefComponent<'a' | 'button' | 'span', TokenProps> = styled(PrimerToken).withConfig({
  shouldForwardProp: prop => (prop as keyof TokenProps) !== 'sx',
})<TokenProps>`
  ${sx}
`

export {Token, type TokenProps}
