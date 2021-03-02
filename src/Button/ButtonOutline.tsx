import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import theme from '../theme'
import {ComponentProps} from '../utils/types'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'

const ButtonOutline = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('colors.btn.outline.text')};
  border: 1px solid ${get('colors.btn.border')};
  background-color: ${get('colors.btn.bg')};
  box-shadow: ${get('shadows.btn.shadow')};

  &:hover {
    color: ${get('colors.btn.outline.hoverText')};
    background-color: ${get('colors.btn.outline.hoverBg')};
    border-color: ${get('colors.btn.outline.hoverBorder')};
    box-shadow: ${get('shadows.btn.outline.hoverShadow')};
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    box-shadow: ${get('colors.btn.outline.focusShadow')};
  }

  &:active {
    color: ${get('colors.btn.outline.selectedText')};
    background-color: ${get('colors.btn.outline.selectedBg')};
    box-shadow: ${get('shadows.btn.outline.selectedShadow')};
    border-color: ${get('shadows.btn.outline.selectedBorder')};
  }

  &:disabled {
    color: ${get('colors.btn.outline.disabledText')};
    background-color: ${get('buttons.outline.disabledBg')};
    border: ${get('buttons.outline.disabledBorder')};
  }

  ${buttonSystemProps};
  ${sx};
`

ButtonOutline.defaultProps = {
  theme
}

export type ButtonOutlineProps = ComponentProps<typeof ButtonOutline>
export default ButtonOutline
