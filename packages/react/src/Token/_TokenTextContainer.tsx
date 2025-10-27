/* eslint-disable primer-react/spread-props-first */
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
      className={clsx(classes.TokenTextContainer)}
      id={id?.toString()}
      {...(Component === 'button'
        ? (props as React.ButtonHTMLAttributes<HTMLButtonElement>)
        : Component === 'a'
          ? (props as React.AnchorHTMLAttributes<HTMLAnchorElement>)
          : (props as React.HTMLAttributes<HTMLSpanElement>))}
    >
      {children}
    </Component>
  )
}

export default TokenTextContainer
