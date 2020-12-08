import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import isNumeric from './utils/isNumeric'
import theme from './theme'
import sx from './sx'
import StyledOcticon from './StyledOcticon'

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128,
}

const sizeStyles = ({size, variant}) => {
  const calc = isNumeric(size) ? size : variantSizes[variant]
  return {
    width: calc,
    height: calc,
  }
}

const CircleBadge = styled.div`
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  align-items: center;
  justify-content: center;
  background-color: ${get('colors.white')};
  border-radius: 50%;
  box-shadow: ${get('shadows.medium')};
  ${COMMON} ${sizeStyles};
  ${sx};
`

CircleBadge.Icon = (props) => (
  <StyledOcticon {...props} sx={Object.assign(props.sx, {height: 'auto', maxWidth: '60%', maxHeight: '55%'})} />
)

CircleBadge.defaultProps = {
  inline: false,
  theme,
  variant: 'medium',
}

CircleBadge.propTypes = {
  inline: PropTypes.bool,
  size: PropTypes.number,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'medium', 'large']),
  ...COMMON.propTypes,
  ...sx.propTypes,
}

CircleBadge.Icon.defaultProps = {
  theme,
  sx: {},
}

CircleBadge.Icon.propTypes = {
  ...StyledOcticon.propTypes,
}

CircleBadge.Icon.displayName = 'CircleBadge.Icon'

export default CircleBadge
