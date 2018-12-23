import React from 'react'
import styled from 'styled-components'
import Button from './Button'

const ButtonDanger = styled(Button)`
  color: rgb(203, 36, 49);
  background-color: rgb(250, 251, 252);
  background-image: linear-gradient(-180deg, rgb(250, 251, 252) 0%, rgb(239, 243, 246) 90%);

  &:hover {
    color: rgb(255, 255, 255);
    background-color: rgb(203, 36, 49);
    background-image: linear-gradient(-180deg, rgb(222, 68, 80) 0%, rgb(203, 36, 49) 90%);
    border-color: rgba(27, 31, 35, 0.5);
  }

  &:focus {
    box-shadow: rgba(203, 36, 49, 0.4) 0px 0px 0px 0.2em;
  }

  &:active {
    color: rgb(255, 255, 255);
    background-color: rgb(181, 32, 44);
    background-image: none;
    box-shadow: rgba(27, 31, 35, 0.15) 0px 0.15em 0.3em inset;
    border-color: rgba(27, 31, 35, 0.5);
  }
`

export default ButtonDanger
