import React from 'react'
import styled, {createGlobalStyle} from 'styled-components'
import {COMMON, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import {useTheme} from './ThemeProvider'
import {ComponentProps} from './utils/types'

// load polyfill for :focus-visible
import 'focus-visible'

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

  /* Popover API Polyfill */
  [popover="" i],
  [popover=auto i],
  [popover=manual i] {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    padding: 1em;
    width: fit-content;
    height: fit-content;
    border: 1px solid;
    background: white;
    color: black;
    overflow: auto;
    margin: auto;
    inset-inline-start: 0;
    inset-inline-end: 0;
    inset-block-start: 0;
    inset-block-end: 0;
  }
  [popover="" i].\\:open,
  [popover=auto i].\\:open,
  [popover=manual i].\\:open {
    display: block;
    position: fixed;
    z-index: 2147483647;
  }
  @media (prefers-color-scheme: dark) {
    [popover="" i],
    [popover=auto i],
    [popover=manual i] {
      background: black;
      color: white;
    }
  }
  [popover]:not(:-internal-popover-hidden) {
    display: block;
  }
`

const Base = styled.div<SystemTypographyProps & SystemCommonProps>`
  ${TYPOGRAPHY};
  ${COMMON};
`

export type BaseStylesProps = ComponentProps<typeof Base>

function BaseStyles(props: BaseStylesProps) {
  const {children, ...rest} = props
  const {colorScheme} = useTheme()

  return (
    <Base {...rest} data-portal-root>
      <GlobalStyle colorScheme={colorScheme?.includes('dark') ? 'dark' : 'light'} />
      {children}
    </Base>
  )
}

BaseStyles.defaultProps = {
  color: 'fg.default',
  fontFamily: 'normal',
  lineHeight: 'default',
}

export default BaseStyles
