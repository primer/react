import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {get} from '../constants'
import theme from '../theme'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'
import {ComponentProps} from '../utils/types'

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
    border-color: rgba(27, 31, 35, 0.15);
    box-shadow: ${get('buttons.default.shadow.focus')};
  }


  ${buttonSystemProps};
  ${sx}
`

ButtonInvisible.defaultProps = {
  theme
}

ButtonInvisible.propTypes = {
  ...ButtonBase.propTypes,
  ...sx.propTypes
}

export type ButtonInvisibleProps = ComponentProps<typeof ButtonInvisible>
export default ButtonInvisible
