import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'

const ButtonInvisible = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('colors.accent.fg')};
  background-color: transparent;
  border: 0;
  border-radius: ${get('radii.2')};
  box-shadow: none;

  &:disabled {
    color: ${get('colors.primer.fg.disabled')};
  }
  &:focus {
    box-shadow: ${get('shadows.btn.focusShadow')};
  }
  &:hover {
    background-color: ${get('colors.btn.hoverBg')};
  }
  &:active {
    background-color: ${get('colors.btn.selectedBg')};
  }

  ${buttonSystemProps};
  ${sx}
`

export type ButtonInvisibleProps = ComponentProps<typeof ButtonInvisible>
export default ButtonInvisible
