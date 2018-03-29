import React from 'react'
import styled from 'styled-components'
import {color} from './utils'
import Button, {inverse} from './Button'

const ButtonDanger = styled(Button)`
  ${inverse(
    color('red.6'),
    color('gray.0'),
    color('gray.1') /* TODO: darken 2% */
  )}
`

export default ButtonDanger
