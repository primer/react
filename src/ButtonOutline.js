import styled from 'styled-components'
import ButtonBase from './ButtonBase'
import {get} from './constants'
import {Platform} from './primitives'

const ButtonOutline = styled(ButtonBase)`
  color: ${get('buttons.outline.color.default')};
  border: 1px solid ${get('buttons.outline.border.default')};
  background-color: ${get('buttons.outline.bg.default')};
  ${Platform.OS === 'web' ? `box-shadow: ${get('buttons.outline.shadow.default')};` : ''}

  &:hover {
    color: ${get('buttons.outline.color.hover')};
    background-color: ${get('buttons.outline.bg.hover')};
    border-color: ${get('buttons.outline.border.hover')};
    ${Platform.OS === 'web' ? `box-shadow: ${get('buttons.outline.shadow.hover')};` : ''}
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    ${Platform.OS === 'web' ? `box-shadow: ${get('buttons.outline.shadow.focus')};` : ''}
  }

  &:active {
    color: ${get('buttons.outline.color.active')};
    background-color: ${get('buttons.outline.bg.active')};
    border-color: ${get('buttons.outline.border.active')};
    ${Platform.OS === 'web' ? `box-shadow: ${get('buttons.outline.shadow.active')};` : ''}
  }

  &:disabled {
    color: ${get('buttons.outline.color.disabled')};
    border-color: ${get('buttons.outline.border.default')};
    background-color: ${get('buttons.outline.bg.disabled')};
  }
`

export default ButtonOutline
