import React from 'react'
import styled, {createGlobalStyle} from 'styled-components'
import {COMMON, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import {ComponentProps} from './utils/types'

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body { margin: 0; }
  table { border-collapse: collapse; }
  
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

export type BaseStylesProps = ComponentProps<typeof Base>

function BaseStyles(props: BaseStylesProps) {
  const {children, ...rest} = props

  // load polyfill for :focus-visible
  require('focus-visible')

  return (
    <Base {...rest} data-portal-root>
      <GlobalStyle />
      {children}
    </Base>
  )
}

BaseStyles.defaultProps = {
  color: 'text.primary',
  fontFamily: 'normal',
  lineHeight: 'default'
}

export default BaseStyles
