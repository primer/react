import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ForwardRefComponent, IntrinsicElement} from '../utils/polymorphic'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'

export type ButtonProps = ButtonBaseProps & ButtonSystemProps & SxProp

type ButtonComponent = ForwardRefComponent<IntrinsicElement<typeof ButtonBase>, ButtonProps>

const Button = styled(ButtonBase)<ButtonProps>`
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
` as ButtonComponent

// export type ButtonProps = ComponentProps<typeof Button>
export default Button
