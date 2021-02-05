/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import {Meta} from '@storybook/react'

import {
  BaseStyles,
  Button,
  ButtonClose,
  ButtonDanger,
  ButtonGroup,
  ButtonInvisible,
  ButtonOutline,
  ButtonPrimary,
  ButtonTableList
} from '..'
import {ButtonStyleProps} from 'styled-system'

export default {
  title: 'Composite components/Button',
  component: Button,
  decorators: [
    Story => {
      return (
        <BaseStyles>
          <Story />
        </BaseStyles>
      )
    }
  ],
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large']
      }
    }
  }
} as Meta

export const defaultButton = (args: ButtonStyleProps) => <Button {...args}>Default Button</Button>
export const dangerButton = (args: ButtonStyleProps) => <ButtonDanger {...args}>Danger Button</ButtonDanger>
export const outlineButton = (args: ButtonStyleProps) => <ButtonOutline {...args}>Outline Button</ButtonOutline>
export const primaryButton = (args: ButtonStyleProps) => <ButtonPrimary {...args}>Primary Button</ButtonPrimary>
export const invisibleButton = (args: ButtonStyleProps) => <ButtonInvisible {...args}>Invisible Button</ButtonInvisible>

export const closeButton = (args: ButtonStyleProps) => (
  // @ts-expect-error Are types for ButtonClose wrong?
  <ButtonClose {...args} onClick={() => alert('button clicked.')} />
)
export const buttonGroup = (args: ButtonStyleProps) => (
  <ButtonGroup display="block" my={2}>
    <Button {...args}>Button 1</Button>
    <Button {...args}>Button 2</Button>
    <Button {...args}>Button 3</Button>
  </ButtonGroup>
)
export const buttonTableList = (args: ButtonStyleProps) => (
  <ButtonTableList {...args}>Button Table List</ButtonTableList>
)

defaultButton.args = {variant: 'medium'}
dangerButton.args = {variant: 'medium'}
outlineButton.args = {variant: 'medium'}
primaryButton.args = {variant: 'medium'}
invisibleButton.args = {variant: 'medium'}
closeButton.args = {variant: 'medium'}
buttonGroup.args = {variant: 'medium'}
buttonTableList.args = {variant: 'medium'}
