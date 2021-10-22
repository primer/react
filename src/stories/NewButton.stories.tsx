import React from 'react'
import Button, {ButtonProps} from '../NewButton'
import {BaseStyles, ThemeProvider} from '..'
import {Meta} from '@storybook/react'
import {XIcon, SearchIcon} from '@primer/octicons-react'

export default {
  title: 'Composite components/New Button',

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
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large']
      }
    }
  }
} as Meta

export const defaultButton = ({size = 'medium', ...args}: ButtonProps) => {
  return (
    <Button size={size} {...args}>
      Default
    </Button>
  )
}

export const iconBeforeButton = (args: ButtonProps) => {
  return (
    <Button {...args}>
      <Button.Visual sx={{pr: 3}}>
        <SearchIcon />
      </Button.Visual>
      Before
    </Button>
  )
}

export const iconAfterButton = (args: ButtonProps) => {
  return (
    <Button {...args}>
      After
      <Button.Visual sx={{pl: 2}}>
        <XIcon />
      </Button.Visual>
    </Button>
  )
}

export const iconButton = (args: ButtonProps) => {
  return (
    <Button {...args}>
      <Button.Visual>
        <XIcon />
      </Button.Visual>
    </Button>
  )
}

export const primaryButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="primary">
      Primary
    </Button>
  )
}

export const dangerButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="danger">
      Danger
    </Button>
  )
}

export const invisibleButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="invisible">
      <Button.Visual sx={{pr: 3}}>
        <SearchIcon />
      </Button.Visual>
      Invisible
    </Button>
  )
}
