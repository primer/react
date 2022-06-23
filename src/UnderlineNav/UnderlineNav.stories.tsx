import React from 'react'
import {EyeIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import UnderlineNav, {UnderlineNavProps} from './index'
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

const items: string[] = [
  'Item 1',
  'Looooong Item',
  'Looooooonger item',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9',
  'Item 10'
]

export const InternalResponsiveNav = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      {items.map(item => (
        <UnderlineNav.Link key={item} leadingIcon={EyeIcon}>
          {item}
        </UnderlineNav.Link>
      ))}
    </UnderlineNav>
  )
}

export const HorizontalScrollNav = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args} overflow="scroll">
      {items.map(item => (
        <UnderlineNav.Link key={item} leadingIcon={EyeIcon}>
          {item}
        </UnderlineNav.Link>
      ))}
    </UnderlineNav>
  )
}
