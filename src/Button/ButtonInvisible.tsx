import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import theme from '../theme'
import {ComponentProps} from '../utils/types'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'

const ButtonInvisible = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('colors.blue.5')};
  background-color: transparent;
  border: 0;
  border-radius: ${get('radii.2')};
  box-shadow: none;

  &:disabled {
    color: ${get('buttons.default.color.disabled')};
  }

  &:focus {
    box-shadow: ${get('buttons.default.shadow.focus')};
  }

  ${buttonSystemProps};
  ${sx}
`

ButtonInvisible.defaultProps = {
  theme
}

export type ButtonInvisibleProps = ComponentProps<typeof ButtonInvisible>
export default ButtonInvisible
