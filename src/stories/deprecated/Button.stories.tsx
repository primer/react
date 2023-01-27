import React from 'react'
import {Meta} from '@storybook/react'

import {
  Button,
  ButtonClose,
  ButtonDanger,
  ButtonInvisible,
  ButtonOutline,
  ButtonPrimary,
  ButtonTableList,
} from '../../deprecated'
import {ButtonStyleProps} from 'styled-system'
import {ButtonBaseProps} from '../../deprecated/Button/ButtonBase'
type StrictButtonStyleProps = ButtonStyleProps & {variant: ButtonBaseProps['variant']}

export default {
  title: 'Deprecated components/Button',
  argTypes: {
    as: {
      table: {
        disable: true,
      },
    },
    theme: {
      table: {
        disable: true,
      },
    },
    sx: {
      table: {
        disable: true,
      },
    },
    variant: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large'],
    },
  },
} as Meta

export const DefaultButton = (args: StrictButtonStyleProps) => <Button {...args}>Default Button</Button>
export const DangerButton = (args: StrictButtonStyleProps) => <ButtonDanger {...args}>Danger Button</ButtonDanger>
export const OutlineButton = (args: StrictButtonStyleProps) => <ButtonOutline {...args}>Outline Button</ButtonOutline>
export const PrimaryButton = (args: StrictButtonStyleProps) => <ButtonPrimary {...args}>Primary Button</ButtonPrimary>
export const InvisibleButton = (args: StrictButtonStyleProps) => (
  <ButtonInvisible {...args}>Invisible Button</ButtonInvisible>
)

export const CloseButton = (args: ButtonStyleProps) => (
  <ButtonClose {...args} onClick={() => alert('button clicked.')} />
)
export const ButtonTableList = (args: ButtonStyleProps) => (
  <ButtonTableList {...args}>Button Table List</ButtonTableList>
)
export const DisabledButton = (args: StrictButtonStyleProps) => {
  const props = {disabled: true, ...args}
  return <Button {...props}>Disabled</Button>
}

DefaultButton.args = {variant: 'medium'}
DangerButton.args = {variant: 'medium'}
OutlineButton.args = {variant: 'medium'}
PrimaryButton.args = {variant: 'medium'}
InvisibleButton.args = {variant: 'medium'}
CloseButton.args = {variant: 'medium'}
ButtonTableList.args = {variant: 'medium'}
