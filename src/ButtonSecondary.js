import React from 'react'
import styled from 'styled-components'
import Button, {solid} from './Button'
import {color} from './utils'

const ButtonSecondary = styled(Button)`
  ${solid(
    color('white'),
    color('blue.3'),
    color('blue.4')
  )}
`

export default ButtonSecondary
