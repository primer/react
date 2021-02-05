import styled from 'styled-components'
import sx from '../sx'
import {get} from '../constants'
import theme from '../theme'
import ButtonBase, {ButtonBaseProps, systemStyles} from './ButtonBase'
import {ComponentProps} from '../utils/types'

const ButtonInvisible = styled(ButtonBase)<ButtonBaseProps>`
  color: ${get('colors.blue.5')};
  background-color: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;

  &:disabled {
    color: ${get('buttons.default.color.disabled')};
  }

  ${systemStyles}
  ${sx};
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
