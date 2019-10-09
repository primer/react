import PropTypes from 'prop-types'
import styled from 'styled-components'
import Octicon from '@primer/octicons-react'
import {COMMON, get} from './constants'
import isNumeric from './utils/isNumeric'
import theme from './theme'

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128
}

const sizeStyles = ({size, variant}) => {
  const calc = isNumeric(size) ? size : variantSizes[variant]
  return {
    width: calc,
    height: calc
  }
}

const CircleBadge = styled.div`
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  align-items: center;
  justify-content: center;
  background-color: ${get('colors.white')};
  border-radius: 50%;
  box-shadow: ${get('shadows.medium')};
  ${COMMON} ${sizeStyles};
`

const Icon = styled(Octicon)`
  max-width: 60% !important;
  height: auto !important;
  max-height: 55% !important;
  ${COMMON};
`
CircleBadge.Icon = Icon

CircleBadge.defaultProps = {
  inline: false,
  size: undefined,
  theme,
  variant: 'medium'
}

CircleBadge.propTypes = {
  inline: PropTypes.bool,
  size: PropTypes.number,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'medium', 'large']),
  ...COMMON.propTypes
}

CircleBadge.Icon.defaultProps = {
  theme
}

CircleBadge.Icon.propsTypes = {
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default CircleBadge
