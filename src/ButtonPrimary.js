import React from 'react'
import styled from 'styled-components'
import Button from './Button'
import {get} from './constants'

const ButtonPrimary = styled(Button)`
  color: ${get('colors.button.white')};
  background-color: ${get('colors.button.primaryBg')};
  background-image: linear-gradient(-180deg, ${get('colors.button.primaryBgImage')} 0%, ${get('colors.button.primaryBg')} 90%);

  &:hover {
    background-color: ${get('colors.button.primaryHoverBg')};
    background-image: linear-gradient(-180deg, ${get('colors.button.primaryHoverBgImage')} 0%, ${get('colors.button.primaryHoverBg')} 90%);
    background-position: -0.5em center;
    border-color: ${get('colors.button.primaryBorder')};
  }

  &:active {
    background-color: ${get('colors.button.primaryActiveBg')};
    background-image: none;
    box-shadow: ${get('colors.button.primaryActiveShadow')} 0px 0.15em 0.3em inset;
    border-color: ${get('colors.button.primaryBorder')};
  }

  &:focus {
    box-shadow: rgba(52, 208, 88, 0.4) 0px 0px 0px 0.2em;
  }
`

export default ButtonPrimary
