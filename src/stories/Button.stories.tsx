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
  ButtonTableList,
  ThemeProvider
} from '..'
import {ButtonStyleProps} from 'styled-system'
import {ButtonBaseProps} from '../Button/ButtonBase'
type StrictButtonStyleProps = ButtonStyleProps & {variant: ButtonBaseProps['variant']}

export default {
  title: 'Composite components/Button',

  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    as: {
      table: {
        disable: true
      }
    },
    theme: {
      table: {
        disable: true
      }
    },
    sx: {
      table: {
        disable: true
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large']
      }
    }
  }
} as Meta

const buttonTestGroupStyles = {display: 'flex', gap: '1rem', paddingBottom: '2rem'}

export const defaultButton = (args: StrictButtonStyleProps) => <Button {...args}>Default Button</Button>
export const buttonCorrectionTest = (args: StrictButtonStyleProps) => (
  <>
    <div>Default</div>
    <div style={buttonTestGroupStyles}>
      <div><Button {...args}>Button</Button></div>
      <div><Button {...args} disabled>Disabled</Button></div>
    </div>
    <div>Outline</div>
    <div style={buttonTestGroupStyles}>
      <div><ButtonOutline {...args}>Button</ButtonOutline></div>
      <div><ButtonOutline {...args} disabled>Disabled</ButtonOutline></div>
    </div>
    <div>Invisible</div>
    <div style={buttonTestGroupStyles}>
      <div><ButtonInvisible {...args}>Button</ButtonInvisible></div>
      <div><ButtonInvisible {...args} disabled>Disabled</ButtonInvisible></div>
    </div>
  </>
)
export const dangerButton = (args: StrictButtonStyleProps) => <ButtonDanger {...args}>Danger Button</ButtonDanger>
export const outlineButton = (args: StrictButtonStyleProps) => <ButtonOutline {...args}>Outline Button</ButtonOutline>
export const primaryButton = (args: StrictButtonStyleProps) => <ButtonPrimary {...args}>Primary Button</ButtonPrimary>
export const invisibleButton = (args: StrictButtonStyleProps) => (
  <ButtonInvisible {...args}>Invisible Button</ButtonInvisible>
)

export const closeButton = (args: ButtonStyleProps) => (
  <ButtonClose {...args} onClick={() => alert('button clicked.')} />
)
export const buttonGroup = (args: StrictButtonStyleProps) => (
  <ButtonGroup display="block" my={2}>
    <Button {...args}>Button 1</Button>
    <Button {...args}>Button 2</Button>
    <Button {...args}>Button 3</Button>
  </ButtonGroup>
)
export const buttonTableList = (args: ButtonStyleProps) => (
  <ButtonTableList {...args}>Button Table List</ButtonTableList>
)

buttonCorrectionTest.args = {variant: 'medium'}
defaultButton.args = {variant: 'medium'}
dangerButton.args = {variant: 'medium'}
outlineButton.args = {variant: 'medium'}
primaryButton.args = {variant: 'medium'}
invisibleButton.args = {variant: 'medium'}
closeButton.args = {variant: 'medium'}
buttonGroup.args = {variant: 'medium'}
buttonTableList.args = {variant: 'medium'}
