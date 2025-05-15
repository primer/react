import type React from 'react'
import {type CSSProperties, type PropsWithChildren} from 'react'
import {clsx} from 'clsx'
import type {SystemCommonProps, SystemTypographyProps} from './constants'
import {useTheme} from './ThemeProvider'
import type {SxProp} from './sx'

import classes from './BaseStyles.module.css'

import 'focus-visible'
import {BoxWithFallback} from './internal/components/BoxWithFallback'

export type BaseStylesProps = PropsWithChildren & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
  color?: string // Fixes `color` ts-error
} & SystemTypographyProps &
  SystemCommonProps &
  SxProp

function BaseStyles({
  children,
  color,
  fontFamily,
  lineHeight,
  className,
  as: Component = 'div',
  style,
  ...rest
}: BaseStylesProps) {
  const {colorMode, colorScheme, dayScheme, nightScheme} = useTheme()

  const newClassName = clsx(classes.BaseStyles, className)
  const baseStyles = {
    ['--BaseStyles-fgColor']: color,
    ['--BaseStyles-fontFamily']: fontFamily,
    ['--BaseStyles-lineHeight']: lineHeight,
  }

  return (
    <BoxWithFallback
      as={Component}
      className={newClassName}
      data-portal-root
      /**
       * We need to map valid primer/react color modes onto valid color modes for primer/primitives
       * valid color modes for primer/primitives: auto | light | dark
       * valid color modes for primer/primer: auto | day | night | light | dark
       */
      data-color-mode={colorMode === 'auto' ? 'auto' : colorScheme?.includes('dark') ? 'dark' : 'light'}
      data-light-theme={dayScheme}
      data-dark-theme={nightScheme}
      style={{
        ...baseStyles,
        ...style,
      }}
      {...rest}
    >
      {children}
    </BoxWithFallback>
  )
}

export default BaseStyles
