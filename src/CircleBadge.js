import PropTypes from 'prop-types'
import styled from 'styled-components'
import Octicon from '@githubprimer/octicons-react'
import {COMMON, Base, get} from './constants'
import theme from './theme'

const sizeMapper = (size = 'medium') => {
  if (typeof size === 'number') return size
  const map = {
    small: 56,
    medium: 96,
    large: 128
  }
  return map[size]
}

const sizeStyles = ({size}) => {
  return {
    width: sizeMapper(size),
    height: sizeMapper(size)
  }
}

const CircleBadge = styled(Base)`
  display: flex;
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
  theme,
  is: 'div',
  size: 'medium'
}

CircleBadge.propTypes = {
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  size: PropTypes.oneOfType([PropTypes.oneOf(['small', 'medium', 'large']), PropTypes.number]),
  theme: PropTypes.object,
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
