import styled from 'styled-components'
import Button from './Button'
import {get} from './constants'

const ButtonPrimary = styled(Button)`
  color: ${get('colors.button.white')};
  background-color: ${get('colors.button.primaryBg')};
  border-color: ${get('colors.button.primaryBorder')};
  box-shadow: ${get('shadows.primaryShadow')};

  &:hover {
    background-color: ${get('colors.button.primaryHoverBg')};
    border-color: ${get('colors.button.primaryHoverBorder')};
  }

  &:active {
    background-color: ${get('colors.button.primaryActiveBg')};
    box-shadow: ${get('shadows.primaryActiveShadow')};
  }

  &:focus {
    outline: none;
    box-shadow: none;
    background-color: ${get('colors.button.primaryFocusBg')};
    border: 3px solid ${get('colors.button.primaryFocusOutline')};
  }
  &:disabled {
    color: ${get('colors.button.primaryDisabledColor')};
    background-color: ${get('colors.button.primaryDisabledBg')};
    border-color: ${get('colors.button.primaryDisabledBorder')};
  }
`

export default ButtonPrimary
