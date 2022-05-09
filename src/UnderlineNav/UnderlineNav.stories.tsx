import React, {useRef, useEffect, useState, useCallback} from 'react'
import {EyeIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import UnderlineNav, {UnderlineNavProps} from '.'
import {BaseStyles, ThemeProvider, ActionList, ActionMenu} from '..'
import {useResizeObserver} from '../hooks/useResizeObserver'

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
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9',
  'Item 10'
]
const initItemLength = items.length

export const InternalResponsiveNav = (args: UnderlineNavProps) => {
  return (
    <UnderlineNav {...args}>
      {items.map(item => (
        <UnderlineNav.Link key={item}>{item}</UnderlineNav.Link>
      ))}
    </UnderlineNav>
  )
}
export const ResponsiveNav = (args: UnderlineNavProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [itemLength, setItemLength] = useState<number>(initItemLength)
  const [width, setWidth] = useState<number>(0)
  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
    }
  }, [])
  const updateItemLength = useCallback(() => {
    if (window.innerWidth < width) {
      const singleItemWidth = width / initItemLength
      setItemLength(window.innerWidth / singleItemWidth)
    } else {
      setItemLength(initItemLength)
    }
  }, [width])
  useResizeObserver(updateItemLength)
  const showItems: string[] = []
  const hideItems: string[] = []
  let index = 0
  for (const item of items) {
    if (index < itemLength) {
      showItems.push(item)
    } else {
      hideItems.push(item)
    }
    index = index + 1
  }
  const Actions = () => {
    return (
      <ActionMenu>
        <ActionMenu.Button>Hidden</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList>
            {hideItems.map(item => (
              <ActionList.Item key={item}>{item}</ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    )
  }
  return (
    <UnderlineNav {...(hideItems.length > 0 ? {actions: Actions} : {})} ref={ref} {...args}>
      {showItems.map(item => (
        <UnderlineNav.Link key={item}>{item}</UnderlineNav.Link>
      ))}
    </UnderlineNav>
  )
}
