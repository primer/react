import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {get} from '../constants'
import theme from '../theme'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'
import {ComponentProps} from '../utils/types'

const Button = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
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
    border-color: rgba(27, 31, 35, 0.15);
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

  ${buttonSystemProps};
  ${sx};
`

Button.defaultProps = {theme}

export type ButtonProps = ComponentProps<typeof Button>
export default Button
