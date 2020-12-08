import styled from 'styled-components'
import ButtonBase, {systemStyles} from './ButtonBase'
import {get} from '../constants'
import theme from '../theme'
import sx from '../sx'

const ButtonPrimary = styled(ButtonBase)`
  color: ${get('buttons.primary.color.default')};
  background-color: ${get('buttons.primary.bg.default')};
  border: 1px solid ${get('buttons.primary.border.default')};
  box-shadow: ${get('buttons.primary.shadow.default')};

  &:hover {
    background-color: ${get('buttons.primary.bg.hover')};
    border-color: ${get('buttons.primary.border.hover')};
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    box-shadow: ${get('buttons.primary.shadow.focus')};
    background-color: ${get('buttons.primary.bg.focus')};
  }

  &:active {
    background-color: ${get('buttons.primary.bg.active')};
    box-shadow: ${get('buttons.primary.shadow.active')};
    border-color: ${get('buttons.primary.border.active')};
  }

  &:disabled {
    color: ${get('buttons.primary.color.disabled')};
    background-color: ${get('buttons.primary.bg.disabled')};
    border-color: ${get('buttons.primary.border.disabled')};
  }

  ${systemStyles}
  ${sx};
`

ButtonPrimary.defaultProps = {
  theme,
}

ButtonPrimary.propTypes = {
  ...ButtonBase.propTypes,
  ...sx.propTypes,
}

export default ButtonPrimary
