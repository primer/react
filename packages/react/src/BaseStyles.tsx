import React from 'react'
import {clsx} from 'clsx'
import styled, {createGlobalStyle} from 'styled-components'
import type {SystemCommonProps, SystemTypographyProps} from './constants'
import {COMMON, TYPOGRAPHY} from './constants'
import {useTheme} from './ThemeProvider'
import type {ComponentProps} from './utils/types'
import {useFeatureFlag} from './FeatureFlags'
import {toggleStyledComponent} from './internal/utils/toggleStyledComponent'
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

const Base = styled.div<SystemTypographyProps & SystemCommonProps>`
  ${TYPOGRAPHY};
  ${COMMON};
`

export type BaseStylesProps = ComponentProps<typeof Base> & {
  style?: React.CSSProperties
}

function BaseStyles(props: BaseStylesProps) {
  const {children, color = 'fg.default', fontFamily = 'normal', lineHeight = 'default', className, ...rest} = props

  const {colorScheme, dayScheme, nightScheme} = useTheme()
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const stylingProps = enabled ? {className: clsx(classes.BaseStyles, className)} : {className}

  // const StyledDiv = toggleStyledComponent(CSS_MODULES_FEATURE_FLAG, 'div', Base)

  /**
   * We need to map valid primer/react color modes onto valid color modes for primer/primitives
   * valid color modes for primer/primitives: auto | light | dark
   * valid color modes for primer/primer: auto | day | night | light | dark
   */
  return (
    <Base
      {...rest}
      {...stylingProps}
      color={color}
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      data-portal-root
      data-color-mode={colorScheme?.includes('dark') ? 'dark' : 'light'}
      data-light-theme={dayScheme}
      data-dark-theme={nightScheme}
    >
      {!enabled && <GlobalStyle colorScheme={colorScheme?.includes('dark') ? 'dark' : 'light'} />}
      {children}
    </Base>
  )
}

export default BaseStyles
