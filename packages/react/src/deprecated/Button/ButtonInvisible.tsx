import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {ComponentProps} from '../../utils/types'
import type {ButtonBaseProps} from './ButtonBase'
import ButtonBase from './ButtonBase'

const ButtonInvisible = styled(ButtonBase)<ButtonBaseProps & SxProp>`
  color: ${get('colors.accent.fg')};
  background-color: transparent;
  border: 0;
  border-radius: ${get('radii.2')};
  box-shadow: none;

  &:disabled {
    color: ${get('colors.primer.fg.disabled')};
  }
  &:focus {
    outline: solid 2px ${get('colors.accent.fg')};
  }
  &:hover {
    background-color: ${get('colors.btn.hoverBg')};
  }
  &:active {
    background-color: ${get('colors.btn.selectedBg')};
  }

  ${sx}
`

export type ButtonInvisibleProps = ComponentProps<typeof ButtonInvisible>
export default ButtonInvisible
