import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {system} from 'styled-system'
import {COMMON, TYPOGRAPHY, get, SystemCommonProps, SystemTypographyProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

type StyledLinkProps = {
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

const Link = styled.a<StyledLinkProps>`
  color: ${props => (props.muted ? get('colors.text.secondary')(props) : get('colors.text.link')(props))};
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: ${props => (props.muted ? 'none' : 'underline')};
    ${props => (props.hoverColor ? hoverColor : props.muted ? `color: ${get('colors.text.secondary')(props)}` : '')};
  }
  &:is(button) {
    display: inline-block;
    padding: 0;
    font-size: inherit;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 0;
    appearance: none;
  }
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
