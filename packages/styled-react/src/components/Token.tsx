import {type TokenProps as PrimerTokenProps, type SxProp, Token as PrimerToken} from '@primer/react'
import {Box} from './Box'
import {forwardRef, type PropsWithChildren} from 'react'

type TokenProps = PropsWithChildren<PrimerTokenProps> & SxProp

const Token = forwardRef<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement, TokenProps>(
  function Token(props, ref) {
    const {sx, ...restProps} = props
    if (sx) {
      // Extract test props and other HTML props that should go on the wrapper
      const {
        'data-testid': dataTestId,
        className,
        style,
        ...tokenProps
      } = restProps as any
      
      return (
        <Box 
          sx={sx} 
          data-testid={dataTestId}
          className={className}
          style={style}
        >
          <PrimerToken ref={ref} {...tokenProps} />
        </Box>
      )
    }
    return <PrimerToken ref={ref} {...restProps} />
  },
)

export {Token, type TokenProps}
