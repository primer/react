import {type TokenProps as PrimerTokenProps, type SxProp, Token as PrimerToken} from '@primer/react'
import {forwardRef} from 'react'
import type {ForwardRefComponent} from '../polymorphic'

type TokenProps = PrimerTokenProps & SxProp

const Token = forwardRef<HTMLElement, TokenProps>(function Token(props, ref) {
  // @ts-expect-error the polymorphic component type is not inferred
  // correctly
  return <Box as={PrimerToken} ref={ref} {...props} />
}) as ForwardRefComponent<'a' | 'button' | 'span', TokenProps>

export {Token, type TokenProps}
