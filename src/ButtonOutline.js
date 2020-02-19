import styled from 'styled-components'
import ButtonBase from './ButtonBase'
import {get} from './constants'

const ButtonOutline = styled(ButtonBase)`
  color: ${get('colors.button.outlineBlue')};
  background-color: ${get('colors.button.white')};
  background-image: none;

  &:hover {
    color: ${get('colors.button.white')};
    background-color: ${get('colors.button.outlineBlue')};
    background-image: none;
    border-color: ${get('colors.button.outlineBlue')};
  }

  &:active {
    color: ${get('colors.button.white')};
    background-color: ${get('colors.button.outlineBlue')};
    background-image: none;
    border-color: ${get('colors.button.outlineBlue')};
  }

  &:focus {
    box-shadow: ${get('colors.button.outlineShadow')} 0px 0px 0px 0.2em;
    border-color: ${get('colors.button.outlineBlue')};
  }

  &:disabled {
    color: ${get('colors.blackfade30')};
    background-color: ${get('colors.white')};
    border-color: ${get('colors.blackfade15')};
    box-shadow: none;
  }
`

export default ButtonOutline
