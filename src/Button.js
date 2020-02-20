import PropTypes from 'prop-types'
import styled from 'styled-components'
import systemPropTypes from '@styled-system/prop-types'
import {COMMON, get} from './constants'
import theme from './theme'
import ButtonBase from './ButtonBase'

const Button = styled(ButtonBase)`
  color: ${get('buttons.default.color.default')};
  background-color: ${get('buttons.default.bg.default')};
  border: 1px solid ${get('buttons.default.border.default')};
  box-shadow: ${get('buttons.default.shadow.default')};

  &:hover {
    background-color: ${get('buttons.default.bg.hover')};
    border-color: ${get('buttons.default.border.hover')};
    box-shadow: ${get('buttons.default.shadow.hover')};
  }
  
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
  }

  &:active {
    background-color: ${get('buttons.default.bg.active')};
    box-shadow: ${get('buttons.default.shadow.active')};
    border-color: ${get('buttons.default.border.active')};
  }

  &:disabled {
    color: ${get('buttons.default.color.disabled')};
    background-color: ${get('buttons.default.bg.disabled')};
    border-color: ${get('buttons.default.border.disabled')};
  }
`

Button.defaultProps = {
  theme,
}

Button.propTypes = {
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...systemPropTypes.layout
}

export default Button
