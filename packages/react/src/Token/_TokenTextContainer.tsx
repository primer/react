import type {TokenBaseProps} from './TokenBase'
import type React from 'react'
import classes from './_TokenTextContainer.module.css'
import {clsx} from 'clsx'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

const TokenTextContainer = ({children, ...props}: React.PropsWithChildren<Partial<TokenBaseProps>>) => {
  return (
    <BoxWithFallback as="span" className={clsx(classes.TokenTextContainer)} {...props}>
      {children}
    </BoxWithFallback>
  )
}

export default TokenTextContainer
