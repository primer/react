import React from 'react'
import styled from 'styled-components'
import Button from './Button'

const ButtonPrimary = styled(Button)`
  color: rgb(255, 255, 255);
  background-color: rgb(40, 167, 69);
  background-image: linear-gradient(-180deg, rgb(52, 208, 88) 0%, rgb(40, 167, 69) 90%);

  &:hover {
    background-color: rgb(38, 159, 66);
    background-image: linear-gradient(-180deg, rgb(47, 203, 83) 0%, rgb(38, 159, 66) 90%);
    background-position: -0.5em center;
    border-color: rgba(27, 31, 35, 0.5);
  }

  &:active {
    background-color: rgb(39, 159, 67);
    background-image: none;
    box-shadow: rgba(27, 31, 35, 0.15) 0px 0.15em 0.3em inset;
    border-color: rgba(27, 31, 35, 0.5);
  }

  &:focus {
    box-shadow: rgba(52, 208, 88, 0.4) 0px 0px 0px 0.2em;
  }
`

export default ButtonPrimary
