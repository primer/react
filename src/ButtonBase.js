import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, LAYOUT} from './constants'
import theme from './theme'
import buttonBaseStyles from './ButtonStyles'
import {compose, variant, fontSize} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'

const variants = variant({
  variants: {
    small: {
      p: '4px 12px',
      fontSize: 0
    },
    medium: {
      fontSize: 1
    },
    large: {
      fontSize: 2,
      p: '10px 20px'
    }
  }
})

const ButtonBase = styled.button.attrs(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick
}))`
  ${buttonBaseStyles}
  ${variants}
  ${compose(fontSize, COMMON, LAYOUT)}
`

ButtonBase.defaultProps = {
  theme,
  variant: 'medium'
}

ButtonBase.propTypes = {
  as: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.elementType]),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  fontSize: systemPropTypes.typography.fontSize,
  onClick: PropTypes.func,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'medium', 'large']),
  ...COMMON.propTypes,
  ...LAYOUT.propTypes
}

export default ButtonBase
