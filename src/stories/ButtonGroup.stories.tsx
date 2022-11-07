import React from 'react'
import {Story, Meta} from '@storybook/react'
import ButtonGroup from '../ButtonGroup'
import {Button, ButtonProps} from '../Button'

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    as: {table: {disable: true}},
    ref: {table: {disable: true}},
    theme: {table: {disable: true}},
    forwardedAs: {table: {disable: true}},
    sx: {table: {disable: true}}
  }
} as Meta<typeof ButtonGroup>

export const Default = () => (
  <ButtonGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </ButtonGroup>
)

export const Playground: Story<ButtonProps> = args => (
  <ButtonGroup>
    <Button {...args}>Button 1</Button>
    <Button {...args}>Button 2</Button>
    <Button {...args}>Button 3</Button>
  </ButtonGroup>
)
Playground.args = {
  size: 'medium',
  disabled: false
}
Playground.argTypes = {
  size: {
    control: {
      type: 'radio'
    },
    options: ['small', 'medium', 'large']
  },
  disabled: {
    control: {
      type: 'boolean'
    }
  }
}
