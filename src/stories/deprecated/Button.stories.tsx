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

export const defaultButton = {
  render: (args: StrictButtonStyleProps) => <Button {...args}>Default Button</Button>,
  args: {variant: 'medium'},
}

export const dangerButton = {
  render: (args: StrictButtonStyleProps) => <ButtonDanger {...args}>Danger Button</ButtonDanger>,
  args: {variant: 'medium'},
}

export const outlineButton = {
  render: (args: StrictButtonStyleProps) => <ButtonOutline {...args}>Outline Button</ButtonOutline>,
  args: {variant: 'medium'},
}

export const primaryButton = {
  render: (args: StrictButtonStyleProps) => <ButtonPrimary {...args}>Primary Button</ButtonPrimary>,
  args: {variant: 'medium'},
}

export const invisibleButton = {
  render: (args: StrictButtonStyleProps) => <ButtonInvisible {...args}>Invisible Button</ButtonInvisible>,

  args: {variant: 'medium'},
}

export const closeButton = {
  render: (args: ButtonStyleProps) => <ButtonClose {...args} onClick={() => alert('button clicked.')} />,

  args: {variant: 'medium'},
}

export const buttonTableList = {
  render: (args: ButtonStyleProps) => <ButtonTableList {...args}>Button Table List</ButtonTableList>,

  args: {variant: 'medium'},
}

export const disabledButton = {
  render: (args: StrictButtonStyleProps) => {
    const props = {disabled: true, ...args}
    return <Button {...props}>Disabled</Button>
  },
}
