import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import getButtonStyles from './ButtonStyles'
import {width} from 'styled-system'

function fontSize({size = '14px', ...props}) {
  return {
    fontSize:
      size === 'sm' ? `${get('fontSizes.0')(props)}px` : size === 'large' ? `${get('fontSizes.2')(props)}px` : size
  }
}

const ButtonBase = ({as: Tag, onClick, disabled, theme, ...rest}) => {
  return <Tag disabled={disabled} onClick={disabled ? undefined : onClick} {...rest} />
}

const Button = styled(ButtonBase)`
  ${props => (props.theme ? getButtonStyles(props.theme) : '')};
  ${fontSize};
  ${COMMON};
  ${width};
`

Button.defaultProps = {
  as: 'button',
  theme
}

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  as: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.func]),
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'large']),
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...width.propTypes
}

export default Button
