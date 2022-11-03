import React from 'react'
import {Meta} from '@storybook/react'
import {ActionList} from '.'
import {LinkItem} from './LinkItem'
import {TypographyIcon, VersionsIcon, SearchIcon, ArrowRightIcon, ArrowLeftIcon} from '@primer/octicons-react'

const icons = ['unset', 'TypographyIcon', 'VersionsIcon', 'SearchIcon', 'ArrowRightIcon', 'ArrowLeftIcon']

export default {
  title: 'Components/ActionList/LinkItem',
  component: LinkItem,
  args: {
    active: false,
    disabled: false,
    role: 'listitem',
    id: 'item-1',
    leadingVisual: null,
    trailingVisual: null
  },
  argTypes: {
    active: {
      control: {
        type: 'boolean'
      }
    },
    role: {
      type: 'string'
    },
    id: {
      type: 'string'
    },
    leadingVisual: {
      control: {
        type: 'select'
      },
      options: icons
    },
    trailingVisual: {
      control: {
        type: 'select'
      },
      options: icons
    },
    href: {
      type: 'string'
    }
  }
  // parameters: {controls: {exclude: excludedControlKeys}}
} as Meta<typeof LinkItem>

// @ts-ignore ignoring types here to pass in options for icon selection in Storybook
export const Playground = args => {
  let leadingVisual
  if (args.leadingVisual === 'TypographyIcon') {
    leadingVisual = <TypographyIcon />
  } else if (args.leadingVisual === 'VersionsIcon') {
    leadingVisual = <VersionsIcon />
  } else if (args.leadingVisual === 'SearchIcon') {
    leadingVisual = <SearchIcon />
  } else if (args.leadingVisual === 'ArrowRightIcon') {
    leadingVisual = <ArrowRightIcon />
  } else if (args.leadingVisual === 'ArrowLeftIcon') {
    leadingVisual = <ArrowLeftIcon />
  } else if (args.leadingVisual === 'unset') {
    leadingVisual = null
  }

  let trailingVisual
  if (args.trailingVisual === 'TypographyIcon') {
    trailingVisual = <TypographyIcon />
  } else if (args.trailingVisual === 'VersionsIcon') {
    trailingVisual = <VersionsIcon />
  } else if (args.trailingVisual === 'SearchIcon') {
    trailingVisual = <SearchIcon />
  } else if (args.trailingVisual === 'ArrowRightIcon') {
    trailingVisual = <ArrowRightIcon />
  } else if (args.trailingVisual === 'ArrowLeftIcon') {
    trailingVisual = <ArrowLeftIcon />
  } else if (args.trailingVisual === 'unset') {
    trailingVisual = null
  }

  return (
    <ActionList>
      <ActionList.LinkItem {...args}>
        {leadingVisual && <ActionList.LeadingVisual>{leadingVisual}</ActionList.LeadingVisual>}
        Action list item
        {trailingVisual && <ActionList.TrailingVisual>{trailingVisual}</ActionList.TrailingVisual>}
      </ActionList.LinkItem>
    </ActionList>
  )
}
