import styled from 'styled-components'
import ButtonBase from './ButtonBase'
import {get} from './constants'
import {Platform} from './primitives'

const ButtonDanger = styled(ButtonBase)`
  color: ${get('buttons.danger.color.default')};
  border: 1px solid ${get('buttons.danger.border.default')};
  background-color: ${get('buttons.danger.bg.default')};
  ${Platform.OS === 'web' ? `box-shadow: ${get('buttons.danger.shadow.default')};` : ''}

  &:hover {
    color: ${get('buttons.danger.color.hover')};
    background-color: ${get('buttons.danger.bg.hover')};
    border-color: ${get('buttons.danger.border.hover')};
    ${Platform.OS === 'web' ? `box-shadow: ${get('buttons.danger.shadow.hover')};` : ''}
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    ${Platform.OS === 'web' ? `box-shadow: ${get('buttons.danger.shadow.focus')};` : ''}
  }

  &:active {
    color: ${get('buttons.danger.color.active')};
    background-color: ${get('buttons.danger.bg.active')};
    ${Platform.OS === 'web' ? `box-shadow: ${get('buttons.danger.shadow.active')};` : ''}
    border-color: ${get('buttons.danger.border.active')};
  }

  &:disabled {
    color: ${get('buttons.danger.color.disabled')};
    background-color: ${get('buttons.danger.bg.disabled')};
    border: 1px solid ${get('buttons.danger.border.default')};
  }
`

export default ButtonDanger
