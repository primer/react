import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {system} from 'styled-system'
import {COMMON, TYPOGRAPHY, get, SystemCommonProps, SystemTypographyProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

type StyledLinkProps = {
  as?: any
  hoverColor?: string
  muted?: boolean
  underline?: boolean
} & SystemCommonProps &
  SxProp &
  SystemTypographyProps

const buttonStyles = `
  display: inline-block;
  padding: 0;
  font-size: inherit;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 0;
  appearance: none;
`

const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors'
  }
})

const Link = styled.a.attrs<StyledLinkProps>(({color, muted}) => ({
  color: color ? color : muted ? 'gray.6' : 'blue.5'
}))<StyledLinkProps>`
  text-decoration: ${({underline}) => (underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: ${({underline}) => (underline ? 'underline' : 'none')};
    ${({hoverColor, muted}) => (hoverColor ? hoverColor : muted ? `color: ${get('colors.blue.5')(theme)}` : '')};
  }
  ${({as}) => (as === 'button' ? buttonStyles : '')};
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`
Link.defaultProps = {
  theme
}

Link.propTypes = {
  hoverColor: PropTypes.string,
  href: PropTypes.string,
  muted: PropTypes.bool,
  theme: PropTypes.object,
  underline: PropTypes.bool,
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  ...sx.propTypes
}

export type LinkProps = ComponentProps<typeof Link>
export default Link
