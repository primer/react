import React from 'react'
import {EyeIcon, CodeIcon, IssueOpenedIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import UnderlineNav, {UnderlineNavProps} from './index'
import CounterLabel from '../CounterLabel'
import {BaseStyles, ThemeProvider} from '..'
import {within, userEvent} from '@storybook/testing-library'
import {expect} from '@storybook/jest'

export default {
  title: 'Layout/UnderlineNav',
  argTypes: {
    align: {
      defaultValue: 'left',
      control: {
        type: 'radio',
        options: ['left', 'right']
      }
    }
  },
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
  ]
} as Meta

export const DefaultNav = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Link selected>Item 1</UnderlineNav.Link>
      <UnderlineNav.Link>Item 2</UnderlineNav.Link>
      <UnderlineNav.Link>Item 3</UnderlineNav.Link>
    </UnderlineNav>
  )
}

// Testing selection
DefaultNav.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const item = await canvas.getByText('Item 1')
  const aElem = await item.closest('a')
  const item2 = await canvas.getByText('Item 2')
  const aElem2 = await item2.closest('a')
  userEvent.click(aElem2 as Element)
  expect(aElem2).toHaveAttribute('aria-current', 'page')
  userEvent.click(aElem as Element)
  expect(aElem).toHaveAttribute('aria-current', 'page')
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

export const withCounterLabels = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      <UnderlineNav.Link selected leadingIcon={CodeIcon}>
        Code
      </UnderlineNav.Link>
      <UnderlineNav.Link leadingIcon={IssueOpenedIcon}>
        Issues{' '}
        <CounterLabel sx={{marginLeft: 1}} scheme="primary">
          12
        </CounterLabel>
      </UnderlineNav.Link>
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
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  return (
    <UnderlineNav {...args}>
      {items.map((item, index) => (
        <UnderlineNav.Link
          key={item}
          leadingIcon={EyeIcon}
          selected={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
        >
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
