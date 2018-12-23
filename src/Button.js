import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, Base} from './constants'
import theme from './theme'
import {width, themeGet} from 'styled-system'


const Button = styled(Base)`
  position: relative;
  display: inline-block;
  padding: 6px 12px;
  color: rgb(36, 41, 46);
  background-color: rgb(239, 243, 246);
  background-image: linear-gradient(-180deg, rgb(250, 251, 252) 0%, rgb(239, 243, 246) 90%);
  font-size: ${themeGet('fontSizes.1', theme.fontSizes[1])}px;
  font-weight: ${themeGet('fontWeights.bold', theme.fontWeights.bold)};
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-repeat: repeat-x;
  background-position: -1px -1px;
  background-size: 110% 110%;
  border: 1px solid rgba(27, 31, 35, 0.2);
  border-radius: 0.25em;
  appearance: none;
  ${COMMON}
  ${width}

  &:hover {
    background-color: rgb(230, 235, 241);
    background-image: linear-gradient(-180deg, rgb(240, 243, 246) 0%, rgb(230, 235, 241) 90%);
    background-position: -0.5em center;
    border-color: rgba(27, 31, 35, 0.35);
    text-decoration: none;
    background-repeat: repeat-x;
  }

  &:active {
    background-color: rgb(233, 236, 239);
    background-image: none;
    box-shadow: rgba(27, 31, 35, 0.15) 0px 0.15em 0.3em inset;
    border-color: rgba(27, 31, 35, 0.35);
  }

  &:focus {
    outline: none;
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 0.2em;
  }
`

Button.defaultProps = {
  is: 'button',
  theme
}

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  is: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.func]),
  onClick: PropTypes.func,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large']),
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...width.propTypes
}

export default Button
