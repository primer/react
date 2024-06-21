import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {ComponentProps} from '../../utils/types'
import type {ButtonBaseProps} from './ButtonBase'
import ButtonBase from './ButtonBase'

/** @deprecated Use the new Label instead. See https://primer.style/react/Button for more details. */
const Button = styled(ButtonBase)<ButtonBaseProps & SxProp>`
  color: ${get('colors.btn.text')};
  background-color: ${get('colors.btn.bg')};
  border: 1px solid ${get('colors.btn.border')};
  box-shadow: ${get('shadows.btn.shadow')}, ${get('shadows.btn.insetShadow')};

  &:hover {
    background-color: ${get('colors.btn.hoverBg')};
    border-color: ${get('colors.btn.hoverBorder')};
  }

  // focus must come before :active so that the active box shadow overrides
  &:focus {
    outline: solid 2px ${get('colors.accent.fg')};
  }

  &:active {
    background-color: ${get('colors.btn.selectedBg')};
    box-shadow: ${get('shadows.btn.shadowActive')};
  }

  &:disabled {
    color: ${get('colors.primer.fg.disabled')};
    background-color: ${get('colors.btn.bg')};
    border-color: ${get('colors.btn.border')};
  }

  ${sx};
`

export type ButtonProps = ComponentProps<typeof Button>
export default Button
