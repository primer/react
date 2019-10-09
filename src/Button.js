import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import buttonStyles from './ButtonStyles'
import {compose, system, layout} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'

const fontSizeVariants = {
  small: get('fontSizes.0'),
  medium: get('fontSizes.1'),
  large: get('fontSizes.2')
}

const variants = ({variant, theme}) => {
  const getter = fontSizeVariants[variant] || fontSizeVariants['medium']
  return {fontSize: getter(theme)}
}

const Button = styled.button.attrs(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick
}))`
  ${buttonStyles}
  ${variants}
  ${compose(
    system({
      fontSize: {
        property: 'fontSize',
        cssProperty: 'fontSize',
        scale: 'fontSizes'
      }
    }),
    COMMON,
    layout
  )}
`

Button.defaultProps = {
  fontSize: undefined,
  theme,
  variant: 'medium'
}

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.func]),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  fontSize: PropTypes.number,
  onClick: PropTypes.func,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'medium', 'large']),
  ...COMMON.propTypes,
  ...systemPropTypes.layout
}

export default Button
