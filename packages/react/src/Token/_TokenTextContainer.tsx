import type {TokenBaseProps} from './TokenBase'
import type React from 'react'
import classes from './_TokenTextContainer.module.css'
import {clsx} from 'clsx'

const TokenTextContainer = ({children, id, ...props}: React.PropsWithChildren<Partial<TokenBaseProps>>) => {
  return (
    <span className={clsx(classes.TokenTextContainer)} id={id?.toString()} {...props}>
      {children}
    </span>
  )
}

export default TokenTextContainer
