import styled from 'styled-components'
import sx from '../sx'
import {get} from '../constants'
import theme from '../theme'
import ButtonBase, {systemStyles} from './ButtonBase'

const ButtonInvisible = styled(ButtonBase)`
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

export default ButtonInvisible
