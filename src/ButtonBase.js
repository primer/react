import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import buttonBaseStyles from './ButtonStyles'
import {compose, variant, layout, fontSize} from 'styled-system'
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
  ${compose(fontSize, COMMON, layout)}
`

ButtonBase.defaultProps = {
  theme,
  variant: 'medium'
}

ButtonBase.propTypes = {
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

export default ButtonBase
