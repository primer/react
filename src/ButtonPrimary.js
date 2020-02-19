import styled from 'styled-components'
import ButtonBase from './ButtonBase'
import {get} from './constants'

const ButtonPrimary = styled(ButtonBase)`
  color: ${get('buttons.primary.color.default')};
  background-color: ${get('buttons.primary.bg.default')};
  border: 1px solid ${get('buttons.primary.border.default')};
  box-shadow: ${get('buttons.primary.shadow.default')};

  &:hover {
    background-color: ${get('buttons.primary.bg.hover')};
    border-color: ${get('buttons.primary.border.hover')};
  }

  &:active {
    background-color: ${get('buttons.primary.bg.active')};
    box-shadow: ${get('buttons.primary.shadow.active')};
  }

  &:focus {
    box-shadow: 0 0 0 3px #94D3A2;
    background-color: ${get('buttons.primary.bg.focus')};
  }
  &:disabled {
    color: ${get('buttons.primary.color.disabled')};
    background-color: ${get('buttons.primary.bg.disabled')};
    border-color: ${get('buttons.primary.border.disabled')};
  }
`

export default ButtonPrimary
