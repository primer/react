import React from 'react'
import type {Meta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {Button} from '../Button'
import {sxOverrideTestStyles} from '../utils/story-helpers'

export default {
  title: 'Components/ButtonGroup/Dev',
  component: ButtonGroup,
} as Meta<typeof ButtonGroup>

export const SxPropStressTest = () => (
  <ButtonGroup sx={sxOverrideTestStyles}>
    <Button sx={sxOverrideTestStyles}>Button 1</Button>
    <Button sx={sxOverrideTestStyles}>Button 2</Button>
    <Button sx={sxOverrideTestStyles}>Button 3</Button>
  </ButtonGroup>
)
