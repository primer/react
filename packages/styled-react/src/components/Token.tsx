import {type TokenProps as PrimerTokenProps, type SxProp, Token as PrimerToken} from '@primer/react'
import {sx} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import styled from 'styled-components'
import type {PropsWithChildren} from 'react'

type TokenProps = PropsWithChildren<PrimerTokenProps> & SxProp

const Token: ForwardRefComponent<'a' | 'button' | 'span', TokenProps> = styled(PrimerToken).withConfig<TokenProps>({
  shouldForwardProp: prop => {
    console.log('Props passed', prop)
    return prop !== 'sx'
  },
})`
  ${sx}
`

export {Token, type TokenProps}
