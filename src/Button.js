import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {darken, desaturate, transparentize} from 'polished'
import {COMMON, Base, get} from './constants'
import baseTheme, {colors} from './theme'
import {width} from 'styled-system'


function fontSize({size = '14px'}) {
  return {
    fontSize:
      size === 'sm' ? `${get('fontSizes.0')}px` :
      size === 'large' ? `${get('fontSizes.2')}px` : size
  }
}

const Button = styled(Base)`
    position: relative;
    display: inline-block;
    padding: 6px 12px;
    color: ${get('colors.gray.9')};
    background-color: ${get('colors.gray.1')};
    background-image: linear-gradient(-180deg, ${get('colors.gray.0')} 0%, ${get('colors.button.bg2')} 90%);
    font-size: ${get('fontSizes.1')}px;
    font-weight: ${get('fontWeights.bold')};
    line-height: 20px;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    background-repeat: repeat-x;
    background-position: -1px -1px;
    background-size: 110% 110%;
    border: 1px solid ${get('colors.button.border')};
    border-radius: 0.25em;
    appearance: none;
    ${fontSize};
    ${COMMON};
    ${width};

    &:hover {
      background-color: ${get('colors.button.hoverBg')};
      background-image: linear-gradient(-180deg, ${get('colors.button.bg2')} 0%, ${get('colors.button.hoverBg')} 90%);
      background-position: -0.5em center;
      border-color: ${get('colors.blackfade35')};
      text-decoration: none;
      background-repeat: repeat-x;
    }

    &:active {
      background-color: ${get('colors.button.activeBg')};
      background-image: none;
      box-shadow: ${get('colors.blackfade15')} 0px 0.15em 0.3em inset; //$btn-active-shadow;
      border-color: ${get('colors.button.border')} //convert black to rbg here
    }

    &:selected {
      background-color: ${get('colors.button.activeBg')};
      background-image: none;
      box-shadow: ${get('colors.blackfade15')} 0px 0.15em 0.3em inset; //$btn-active-shadow;
      border-color: ${get('colors.button.border')};
    }

    &:disabled {
      color: ${get('colors.button.disabledColor')};
      background-color: ${get('colors.gray.1')};
      background-image: none;
      border-color: ${get('colors.blackfade20')}
      box-shadow: none;
    }

    &:focus {
      outline: none;
      box-shadow: ${get('colors.button.focusShadow')} 0px 0px 0px 0.2em;
    }`

Button.defaultProps = {
  is: 'button',
  theme: baseTheme
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
