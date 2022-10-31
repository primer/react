import React from 'react'
import {Story, Meta} from '@storybook/react'
import {ActionList, ActionListItemProps, LinkItem, Group, Divider, Description} from '.'
import {Item} from './Item'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

const unset = undefined
const icons = {unset, FileCodeIcon, EyeIcon, PeopleIcon}

export default {
  title: 'Components/ActionList/Item',
  component: Item,
  args: {
    selected: false,
    active: false,
    disabled: false,
    variant: 'default',
    role: 'listitem',
    id: 'item-1',
    leadingVisual: null,
    trailingVisual: null
  },
  argTypes: {
    selected: {
      control: {
        type: 'boolean'
      }
    },
    active: {
      control: {
        type: 'boolean'
      }
    },
    disabled: {
      control: {
        type: 'boolean'
      }
    },
    variant: {
      control: {
        type: 'radio'
      },
      options: ['default', 'danger']
    },
    role: {
      type: 'string'
    },
    id: {
      type: 'string'
    },
    leadingVisual: {
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    trailingVisual: {
      control: {
        type: 'radio'
      },
      options: ['EyeIcon', 'danger']
    },
    selectionVariant: {
      control: {
        type: 'radio',
        labels: ['single', 'multiple', 'unset']
      },
      options: [0, 1, 2],
      mapping: ['single', 'multiple', null],
      table: {
        category: 'ActionList'
      }
    }
  }
  // parameters: {controls: {exclude: excludedControlKeys}}
} as Meta<typeof Item>

export const Playground: Story<typeof Item> = args => {
  // console.log(args.trailingVisual)
  let visual
  if (args.trailingVisual === 'EyeIcon') {
    visual = <EyeIcon />
  } else if (args.trailingVisual === 'FileCodeIcon') {
    visual = <FileCodeIcon />
  }
  return (
    <ActionList {...args}>
      <ActionList.Item {...args}>
        {/* <ActionList.LeadingVisual>{visuals}</ActionList.LeadingVisual> */}
        Action list item
        <ActionList.Description variant="block">
          Create a brand new Codespace with a fresh image and checkout this branch.
        </ActionList.Description>
        <ActionList.TrailingVisual>{visual}</ActionList.TrailingVisual>
      </ActionList.Item>
    </ActionList>
  )
}

// const myConsole = new console.Console(args.leadingVisual)
