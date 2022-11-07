import React from 'react'
import {DashIcon, PlusIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'

import ButtonGroup from '../ButtonGroup'
import {Button, ButtonProps, IconButton} from '../Button'

export default {
  title: 'Components/ButtonGroup',
  argTypes: {
    size: {
      control: {
        type: 'radio'
      },
      options: ['small', 'medium', 'large']
    },
    disabled: {
      control: {
        type: 'boolean',
        default: false
      }
    }
  }
} as Meta

export const defaultButtonGroup = (args: ButtonProps) => (
  <ButtonGroup>
    <Button {...args}>Button 1</Button>
    <Button {...args}>Button 2</Button>
    <Button {...args}>Button 3</Button>
  </ButtonGroup>
)

export const iconButtonGroup = (args: ButtonProps) => (
  <ButtonGroup>
    <IconButton {...args} aria-label="Zoom out" icon={DashIcon} />
    <IconButton {...args} aria-label="Zoom in" icon={PlusIcon} />
  </ButtonGroup>
)
