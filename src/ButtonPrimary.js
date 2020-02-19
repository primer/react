import styled from 'styled-components'
import Button from './Button'
import {get} from './constants'

const ButtonPrimary = styled(Button)`
  color: ${get('buttons.primary.color.default')};
  background-color: ${get('buttons.primary.bg.default')};
  border-color: ${get('buttons.primary.border.default')};
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
    box-shadow: none;
    background-color: ${get('buttons.primary.bg.focus')};
  }
  &:disabled {
    color: ${get('buttons.primary.color.disabled')};
    background-color: ${get('buttons.primary.bg.disabled')};
    border-color: ${get('buttons.primary.border.disabled')};
  }
`

export default ButtonPrimary
