import React from 'react'
import styled from 'styled-components'
import Button, {solid} from './Button'
import {color} from './utils'

const ButtonPrimary = styled(Button)`
  ${solid(
    color('white'),
    color('green.4'),
    color('green.5')
  )}
`

export default ButtonPrimary
