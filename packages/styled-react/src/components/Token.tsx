import React, {forwardRef} from 'react'
import {type TokenProps as PrimerTokenProps, Token as PrimerToken} from '@primer/react'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import type {PropsWithChildren} from 'react'
import styled from 'styled-components'

type TokenProps = PropsWithChildren<PrimerTokenProps> & SxProp

const StyledToken: ForwardRefComponent<'a' | 'button' | 'span', TokenProps> = styled(PrimerToken).withConfig({
  shouldForwardProp: prop => (prop as keyof TokenProps) !== 'sx',
})<TokenProps>`
  ${sx}
`

const Token = forwardRef<HTMLElement, TokenProps>(({as, ...props}, ref) => {
  return <StyledToken {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'a' | 'button' | 'span', TokenProps>

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Token.__SLOT__ = PrimerToken.__SLOT__

export {Token, type TokenProps}
