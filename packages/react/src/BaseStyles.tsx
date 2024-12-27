import React, {type CSSProperties, type PropsWithChildren} from 'react'
import {clsx} from 'clsx'
import styled, {createGlobalStyle} from 'styled-components'
import type {SystemCommonProps, SystemTypographyProps} from './constants'
import {COMMON, TYPOGRAPHY} from './constants'
import {useTheme} from './ThemeProvider'
import {useFeatureFlag} from './FeatureFlags'
import Box from './Box'
import type {SxProp} from './sx'
import {includesSystemProps, getTypographyAndCommonProps} from './utils/includeSystemProps'

import classes from './BaseStyles.module.css'

// load polyfill for :focus-visible
import 'focus-visible'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

const GlobalStyle = createGlobalStyle<{colorScheme?: 'light' | 'dark'}>`
  * { box-sizing: border-box; }
  body { margin: 0; }
  table { border-collapse: collapse; }
  input { color-scheme: ${props => props.colorScheme}; }

  [role="button"]:focus:not(:focus-visible):not(.focus-visible),
  [role="tabpanel"][tabindex="0"]:focus:not(:focus-visible):not(.focus-visible),
  button:focus:not(:focus-visible):not(.focus-visible),
  summary:focus:not(:focus-visible):not(.focus-visible),
  a:focus:not(:focus-visible):not(.focus-visible) {
    outline: none;
    box-shadow: none;
  }

  [tabindex="0"]:focus:not(:focus-visible):not(.focus-visible),
  details-dialog:focus:not(:focus-visible):not(.focus-visible) {
    outline: none;
  }
`

const StyledDiv = styled.div<SystemTypographyProps & SystemCommonProps>`
  ${TYPOGRAPHY};
  ${COMMON};
`

export type BaseStylesProps = PropsWithChildren & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
  color?: string // Fixes `color` ts-error
} & SystemTypographyProps &
  SystemCommonProps &
  SxProp

function BaseStyles(props: BaseStylesProps) {
  const {
    children,
    color = 'var(--fgColor-default)',
    fontFamily = 'normal',
    lineHeight = 'default',
    className,
    as: Component = 'div',
    ...rest
  } = props

  const {colorScheme, dayScheme, nightScheme} = useTheme()
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  if (enabled) {
    const newClassName = clsx(classes.BaseStyles, className)

    // If props includes TYPOGRAPHY or COMMON props, pass them to the Box component
    if (includesSystemProps(props)) {
      const systemProps = getTypographyAndCommonProps(props)
      return (
        // @ts-ignore shh
        <Box
          as={Component}
          className={newClassName}
          color={color}
          fontFamily={fontFamily}
          lineHeight={lineHeight}
          data-portal-root
          /**
           * We need to map valid primer/react color modes onto valid color modes for primer/primitives
           * valid color modes for primer/primitives: auto | light | dark
           * valid color modes for primer/primer: auto | day | night | light | dark
           */
          data-color-mode={colorScheme?.includes('dark') ? 'dark' : 'light'}
          data-light-theme={dayScheme}
          data-dark-theme={nightScheme}
          style={systemProps}
          {...rest}
        >
          {children}
        </Box>
      )
    }

    return (
      <Component
        className={newClassName}
        color={color}
        fontFamily={fontFamily}
        lineHeight={lineHeight}
        data-portal-root
        /**
         * We need to map valid primer/react color modes onto valid color modes for primer/primitives
         * valid color modes for primer/primitives: auto | light | dark
         * valid color modes for primer/primer: auto | day | night | light | dark
         */
        data-color-mode={colorScheme?.includes('dark') ? 'dark' : 'light'}
        data-light-theme={dayScheme}
        data-dark-theme={nightScheme}
        {...rest}
      >
        {children}
      </Component>
    )
  }

  return (
    <StyledDiv
      className={className}
      color={color}
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      data-portal-root
      /**
       * We need to map valid primer/react color modes onto valid color modes for primer/primitives
       * valid color modes for primer/primitives: auto | light | dark
       * valid color modes for primer/primer: auto | day | night | light | dark
       */
      data-color-mode={colorScheme?.includes('dark') ? 'dark' : 'light'}
      data-light-theme={dayScheme}
      data-dark-theme={nightScheme}
      {...rest}
    >
      <GlobalStyle colorScheme={colorScheme?.includes('dark') ? 'dark' : 'light'} />
      {children}
    </StyledDiv>
  )
}

export default BaseStyles
