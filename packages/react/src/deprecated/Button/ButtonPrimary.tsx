import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {ComponentProps} from '../../utils/types'
import type {ButtonBaseProps} from './ButtonBase'
import ButtonBase from './ButtonBase'

export const ButtonPrimary = styled(ButtonBase)<ButtonBaseProps & SxProp>`
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
    border-color: ${get('colors.btn.primary.focusBorder')};
    box-shadow: ${get('shadows.btn.primary.focusShadow')};
  }

  &:active {
    background-color: ${get('colors.btn.primary.selectedBg')};
    box-shadow: ${get('shadows.btn.primary.selectedShadow')};
  }

  &:disabled {
    color: ${get('colors.btn.primary.disabledText')};
    background-color: ${get('colors.btn.primary.disabledBg')};
    border-color: ${get('colors.btn.primary.disabledBorder')};
  }

  ${sx};
`

export type ButtonPrimaryProps = ComponentProps<typeof ButtonPrimary>
export default ButtonPrimary
