import styled from 'styled-components'
import sx from '../sx'
import {get} from '../constants'
import theme from '../theme'
import ButtonBase, {systemStyles} from './ButtonBase'

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
    border-color: transparent;
    box-shadow: ${get('buttons.default.shadow.focus')};
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

  ${systemStyles}
  ${sx};
`

Button.defaultProps = {
  theme,
}

Button.propTypes = {
  ...ButtonBase.propTypes,
  ...sx.propTypes,
}

export default Button
