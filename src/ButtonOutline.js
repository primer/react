import React from 'react'
import styled from 'styled-components'
import Button from './Button'
import {get} from './constants'

const ButtonOutline = styled(Button)`
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
`

export default ButtonOutline
