import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import buttonStyles from './ButtonStyles'
import {compose, variant, layout, fontSize} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'

const variants = variant({
  variants: {
    small: {
      fontSize: 0
    },
    medium: {
      fontSize: 1
    },
    large: {
      fontSize: 2
    }
  }
})

const Button = styled.button.attrs(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick
}))`
  ${buttonStyles}
  ${variants}
  ${compose(fontSize, COMMON, layout)}
`

Button.defaultProps = {
  theme,
  variant: 'medium'
}

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.func]),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  fontSize: systemPropTypes.typography.fontSize,
  onClick: PropTypes.func,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'medium', 'large']),
  ...COMMON.propTypes,
  ...systemPropTypes.layout
}

export default Button
