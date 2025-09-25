import React from 'react'
import {type TokenProps as PrimerTokenProps, type SxProp, Token as PrimerToken} from '@primer/react'
import {sx} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import styled from 'styled-components'
import type {PropsWithChildren} from 'react'

type TokenProps = PropsWithChildren<PrimerTokenProps> & SxProp

// Create a styled wrapper that only handles the sx prop
const StyledTokenWrapper = styled.span<{sx?: SxProp['sx']}>`
  ${sx}
`

const Token: ForwardRefComponent<'a' | 'button' | 'span', TokenProps> = React.forwardRef<
  HTMLElement,
  TokenProps
>(({sx: sxProp, ...rest}, ref) => {
  // If sx is provided, wrap with styled component, otherwise use PrimerToken directly
  if (sxProp) {
    return (
      <StyledTokenWrapper sx={sxProp}>
        <PrimerToken {...rest} ref={ref} />
      </StyledTokenWrapper>
    )
  }
  
  // Pass all props directly to PrimerToken when no sx styling is needed
  return <PrimerToken {...rest} ref={ref} />
}) as ForwardRefComponent<'a' | 'button' | 'span', TokenProps>

Token.displayName = 'Token'

export {Token, type TokenProps}