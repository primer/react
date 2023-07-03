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
  title: 'Deprecated/Components/Button',
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

// eslint-disable-next-line storybook/prefer-pascal-case
export const defaultButton = (args: StrictButtonStyleProps) => <Button {...args}>Default Button</Button>
defaultButton.args = {variant: 'medium'}

// eslint-disable-next-line storybook/prefer-pascal-case
export const dangerButton = (args: StrictButtonStyleProps) => <ButtonDanger {...args}>Danger Button</ButtonDanger>
dangerButton.args = {variant: 'medium'}

// eslint-disable-next-line storybook/prefer-pascal-case
export const outlineButton = (args: StrictButtonStyleProps) => <ButtonOutline {...args}>Outline Button</ButtonOutline>
outlineButton.args = {variant: 'medium'}

// eslint-disable-next-line storybook/prefer-pascal-case
export const primaryButton = (args: StrictButtonStyleProps) => <ButtonPrimary {...args}>Primary Button</ButtonPrimary>
primaryButton.args = {variant: 'medium'}

// eslint-disable-next-line storybook/prefer-pascal-case
export const invisibleButton = (args: StrictButtonStyleProps) => (
  <ButtonInvisible {...args}>Invisible Button</ButtonInvisible>
)
invisibleButton.args = {variant: 'medium'}

// eslint-disable-next-line storybook/prefer-pascal-case
export const closeButton = (args: ButtonStyleProps) => (
  <ButtonClose {...args} onClick={() => alert('button clicked.')} />
)
closeButton.args = {variant: 'medium'}

// eslint-disable-next-line storybook/prefer-pascal-case
export const buttonTableList = (args: ButtonStyleProps) => (
  <ButtonTableList {...args}>Button Table List</ButtonTableList>
)
buttonTableList.args = {variant: 'medium'}

// eslint-disable-next-line storybook/prefer-pascal-case
export const disabledButton = (args: StrictButtonStyleProps) => {
  const props = {disabled: true, ...args}
  return <Button {...props}>Disabled</Button>
}
