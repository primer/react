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
      <SearchIcon />
      Before
    </Button>
  )
}

export const iconAfterButton = (args: ButtonProps) => {
  return (
    <Button {...args}>
      After
      <XIcon />
    </Button>
  )
}
