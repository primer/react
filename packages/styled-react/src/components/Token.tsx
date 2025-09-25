import {type TokenProps as PrimerTokenProps, type SxProp, Token as PrimerToken} from '@primer/react'
import {Box} from './Box'
import {forwardRef, type PropsWithChildren} from 'react'

type TokenProps = PropsWithChildren<PrimerTokenProps> & SxProp

const Token = forwardRef<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement, TokenProps>(
  function Token(props, ref) {
    const {sx, ...restProps} = props
    if (sx) {
      return (
        <Box sx={sx}>
          <PrimerToken ref={ref} {...restProps} />
        </Box>
      )
    }
    return <PrimerToken ref={ref} {...restProps} />
  },
)

export {Token, type TokenProps}
