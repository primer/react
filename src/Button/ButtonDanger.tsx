import styled from 'styled-components'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'
import {get} from '../constants'
import theme from '../theme'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const ButtonDanger = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('colors.btn.danger.text')};
  border: 1px solid ${get('colors.btn.border')};
  background-color: ${get('colors.btn.bg')};
  box-shadow: ${get('shadows.btn.shadow')};

  &:hover {
    color: ${get('colors.btn.danger.hoverText')};
    background-color: ${get('colors.btn.danger.hoverBg')};
    border-color: ${get('colors.btn.danger.hoverBorder')};
    box-shadow: ${get('shadows.btn.danger.hoverShadow')};
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    box-shadow: ${get('colors.btn.danger.focusShadow')};
  }

  &:active {
    color: ${get('colors.btn.danger.selectedText')};
    background-color: ${get('colors.btn.danger.selectedBg')};
    box-shadow: ${get('shadows.btn.danger.selectedShadow')};
    border-color: ${get('shadows.btn.danger.selectedBorder')};
  }

  &:disabled {
    color: ${get('colors.btn.danger.disabledText')};
    background-color: ${get('buttons.danger.disabledBg')};
    border: ${get('buttons.danger.disabledBorder')};
  }

  ${buttonSystemProps};
  ${sx};
`

ButtonDanger.defaultProps = {
  theme
}

export type ButtonDangerProps = ComponentProps<typeof ButtonDanger>
export default ButtonDanger
