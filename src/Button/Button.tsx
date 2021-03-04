import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'

const Button = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('colors.btn.text')};
  background-color: ${get('colors.btn.bg')};
  border: 1px solid ${get('colors.btn.border')};
  box-shadow: ${get('shadows.btn.shadow')}, ${get('shadows.btn.insetShadow')}};

  &:hover {
    background-color: ${get('colors.btn.hoverBg')};
    border-color: ${get('colors.btn.hoverBorder')};
  }

  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: ${get('colors.btn.focusBorder')};
    box-shadow: ${get('shadows.btn.focusShadow')};
  }

  &:active {
    background-color: ${get('colors.btn.selectedBg')};
    box-shadow: ${get('shadows.btn.shadowActive')};
  }

  &:disabled {
    color: ${get('colors.text.disabled')};
    background-color: ${get('colors.btn.bg')};
    border-color: ${get('colors.btn.border')};
  }

  ${buttonSystemProps};
  ${sx};
`

export type ButtonProps = ComponentProps<typeof Button>
export default Button
