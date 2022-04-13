import {EyeIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import React from 'react'
import {UnderlineNav, UnderlineNavProps} from '.'
import {BaseStyles, ThemeProvider} from '..'

export default {
  title: 'Layout/UnderlineNav',

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
  argTypes: {}
} as Meta

export const defaultNav = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Link selected>Item 1</UnderlineNav.Link>
      <UnderlineNav.Link>Item 2</UnderlineNav.Link>
      <UnderlineNav.Link>Item 3</UnderlineNav.Link>
    </UnderlineNav>
  )
}

export const withIcons = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Link selected leadingIcon={EyeIcon}>
        Item 1
      </UnderlineNav.Link>
      <UnderlineNav.Link>Item 2</UnderlineNav.Link>
    </UnderlineNav>
  )
}

export const rightAlign = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args} align="right">
      <UnderlineNav.Link selected>Item 1</UnderlineNav.Link>
      <UnderlineNav.Link>Item 2dsjsjskdjkajsdhkajsdkasj</UnderlineNav.Link>
      <UnderlineNav.Link>Item 3</UnderlineNav.Link>
    </UnderlineNav>
  )
}
