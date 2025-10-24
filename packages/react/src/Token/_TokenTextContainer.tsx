import type {TokenBaseProps} from './TokenBase'
import type React from 'react'
import classes from './_TokenTextContainer.module.css'
import {clsx} from 'clsx'

const TokenTextContainer = ({
  children,
  id,
  as: Component = 'span',
  ...props
}: React.PropsWithChildren<Partial<TokenBaseProps>>) => {
  return (
    <Component
      {...(Component === 'button'
        ? (props as React.ButtonHTMLAttributes<HTMLButtonElement>)
        : Component === 'a'
          ? (props as React.AnchorHTMLAttributes<HTMLAnchorElement>)
          : (props as React.HTMLAttributes<HTMLSpanElement>))}
      className={clsx(classes.TokenTextContainer)}
      id={id?.toString()}
    >
      {children}
    </Component>
  )
}

export default TokenTextContainer
