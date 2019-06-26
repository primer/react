import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import getButtonStyles from './ButtonStyles'
import {layout} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'

function fontSize({size = '14px', ...props}) {
  return {
    fontSize:
      size === 'sm' ? `${get('fontSizes.0')(props)}px` : size === 'large' ? `${get('fontSizes.2')(props)}px` : size
  }
}

const Button = styled.button.attrs(props => ({
  onClick: props.disabled ? undefined : props.onClick,
  className: props.disabled ? 'disabled' : ''
}))`
  ${props => (props.theme ? getButtonStyles(props.theme) : '')};
  ${fontSize};
  ${COMMON};
  ${layout};
`

Button.defaultProps = {
  theme
}

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.func]),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'large']),
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...systemPropTypes.layout
}

export default Button
