import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {ComponentProps} from '../../utils/types'
import type {ButtonBaseProps} from './ButtonBase'
import ButtonBase from './ButtonBase'

const ButtonDanger = styled(ButtonBase)<ButtonBaseProps & SxProp>`
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
    border-color: ${get('colors.btn.danger.focusBorder')};
    box-shadow: ${get('shadows.btn.danger.focusShadow')};
  }

  &:active {
    color: ${get('colors.btn.danger.selectedText')};
    background-color: ${get('colors.btn.danger.selectedBg')};
    box-shadow: ${get('shadows.btn.danger.selectedShadow')};
    border-color: ${get('colors.btn.danger.selectedBorder')};
  }

  &:disabled {
    color: ${get('colors.btn.danger.disabledText')};
    background-color: ${get('colors.btn.danger.disabledBg')};
    border-color: ${get('colors.btn.danger.disabledBorder')};
  }

  ${sx};
`

export type ButtonDangerProps = ComponentProps<typeof ButtonDanger>
export default ButtonDanger
