import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {system} from 'styled-system'
import {COMMON, TYPOGRAPHY, get, SystemCommonProps, SystemTypographyProps} from './constants'
import sx, { SxProp } from './sx'
import theme from './theme'
import { ComponentProps } from './utils/types';

type LinkBaseProps = {
  as?: React.ReactNode;
  href?: string;
  hoverColor?: string;
  muted?: boolean;
  underline?: boolean;
} & SystemCommonProps & SxProp & SystemTypographyProps

const buttonStyles = {
  display: 'inline-block',
  padding: '0',
  fontSize: 'inherit',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  userSelect: 'none',
  backgroundColor: 'transparent',
  border: '0',
  appearance: 'none'
}

const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors'
  }
})

const linkColor = ({color, muted, ...props}: LinkBaseProps) => ({
  color: color ? color : muted ? 'gray.6' : 'blue.5'
})

const textDecoration = ({underline, ...props}: LinkBaseProps) => underline ? 'underline' : 'none'
const hoverCss = ({hoverColor, muted, ...props}: LinkBaseProps) => hoverColor ? hoverColor : muted ? `color: ${get('colors.blue.5')(theme)}` : ''
const buttonCss = ({as, ...props}: LinkBaseProps) => as === 'button' ? buttonStyles : ''

const Link = styled.a.attrs(linkColor)`
  text-decoration: ${textDecoration};
  &:hover {
    text-decoration: ${textDecoration};
    ${hoverCss};
  }
  ${buttonCss};
  ${TYPOGRAPHY} ${COMMON};
  ${sx};
`

Link.defaultProps = {
  theme
}

Link.propTypes = {
  as: PropTypes.elementType,
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