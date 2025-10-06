import React from 'react'
import {
  type TokenProps as PrimerTokenProps,
  type SxProp,
  Token as PrimerToken,
  useTheme,
  theme as defaultTheme,
} from '@primer/react'
import css from '@styled-system/css'
import type {ForwardRefComponent} from '../polymorphic'
import type {PropsWithChildren} from 'react'

type TokenProps = PropsWithChildren<PrimerTokenProps> & SxProp

const Token: ForwardRefComponent<'a' | 'button' | 'span', TokenProps> = React.forwardRef<HTMLElement, TokenProps>(
  ({sx: sxProp, style, ...rest}, ref) => {
    const contextTheme = useTheme()
    const theme = contextTheme.theme || defaultTheme

    // If no sx prop is provided, just return PrimerToken directly
    if (!sxProp) {
      return <PrimerToken {...rest} style={style} ref={ref} />
    }

    // Convert sx to CSS styles using the theme context
    const sxStyles = css(sxProp)(theme)
    const mergedStyle = {...sxStyles, ...style}

    return <PrimerToken {...rest} style={mergedStyle} ref={ref} />
  },
) as ForwardRefComponent<'a' | 'button' | 'span', TokenProps>

export {Token, type TokenProps}
