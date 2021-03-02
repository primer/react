import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import theme from '../theme'
import {ComponentProps} from '../utils/types'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'

export const ButtonPrimary = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('colors.btn.primary.text')};
  border: 1px solid ${get('colors.btn.primary.border')};
  background-color: ${get('colors.btn.primary.bg')};
  box-shadow: ${get('shadows.btn.primary.shadow')};

  &:hover {
    color: ${get('colors.btn.primary.hoverText')};
    background-color: ${get('colors.btn.primary.hoverBg')};
    border-color: ${get('colors.btn.primary.hoverBorder')};
    box-shadow: ${get('shadows.btn.primary.hoverShadow')};
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    box-shadow: ${get('colors.btn.primary.focusShadow')};
  }

  &:active {
    color: ${get('colors.btn.primary.selectedText')};
    background-color: ${get('colors.btn.primary.selectedBg')};
    box-shadow: ${get('shadows.btn.primary.selectedShadow')};
    border-color: ${get('shadows.btn.primary.selectedBorder')};
  }

  &:disabled {
    color: ${get('colors.btn.primary.disabledText')};
    background-color: ${get('buttons.primary.disabledBg')};
    border: ${get('buttons.primary.disabledBorder')};
  }

  ${buttonSystemProps};
  ${sx};
`

ButtonPrimary.defaultProps = {
  theme
}

export type ButtonPrimaryProps = ComponentProps<typeof ButtonPrimary>
export default ButtonPrimary
