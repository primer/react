import React from 'react'
import styled from 'styled-components'
import Button from './Button'

const ButtonOutline = styled(Button)`
  color: rgb(3, 102, 214);
  background-color: rgb(255, 255, 255);
  background-image: none;

  &:hover {
    color: rgb(255, 255, 255);
    background-color: rgb(3, 102, 214);
    background-image: none;
    border-color: rgb(3, 102, 214);
  }

  &:active {
    color: rgb(255, 255, 255);
    background-color: rgb(3, 102, 214);
    background-image: none;
    border-color: rgb(3, 102, 214);
  }

  &:focus {
    box-shadow: rgba(3, 102, 214, 0.4) 0px 0px 0px 0.2em;
    border-color: rgb(3, 102, 214);
  }
`

export default ButtonOutline
