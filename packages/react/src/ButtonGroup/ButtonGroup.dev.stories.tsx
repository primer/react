import React from 'react'
import type {Meta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {Button} from '../Button'

export default {
  title: 'Components/ButtonGroup/Dev',
  component: ButtonGroup,
} as Meta<typeof ButtonGroup>

export const SxProp = () => (
  <ButtonGroup sx={{border: '1px solid red'}}>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </ButtonGroup>
)
