import React from 'react'
import styled from 'styled-components'
import {darken, lighten} from 'polished'
import Button from './Button'

const ButtonDanger = styled(Button)(({theme}) => {
  const color = theme.colors.red[6]
  const bg = theme.colors.gray[0]
  const bg2 = darken(0.02, theme.colors.gray[1])
  const black = theme.colors.black
  const light10 = lighten(.1, color)
  return `
    color: ${color}
    background-color: ${bg}
    background-image: linear-gradient(-180deg, ${bg} 0%, ${bg2} 90%);

    &:hover {
      color: ${theme.colors.white};
      background-color: ${color};
      background-image: linear-gradient(-180deg, ${light10} 0%, ${color} 90%);
      border-color: ${theme.colors.blackfade50};
    }

    &:focus {
      box-shadow: ${theme.colors.button.dangerFocusShadow} 0px 0px 0px 0.2em;
    }

    &:active {
      color: ${theme.colors.white};
      background-color: ${theme.colors.button.dangerActiveBg};
      background-image: none;
      box-shadow: ${theme.colors.blackfade15} 0px 0.15em 0.3em inset;
      border-color: ${theme.colors.blackfade50};
    }

    &:selected {
      color: ${theme.colors.white}
      background-color: ${theme.colors.button.dangerActiveBg};
      background-image: none;
      box-shadow: ${theme.colors.blackfade15} 0px 0.15em 0.3em inset;
      border-color: ${theme.colors.blackfade50};
    }
  `
})

export default ButtonDanger
