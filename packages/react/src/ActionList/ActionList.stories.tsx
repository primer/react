import type {StoryFn, Meta} from '@storybook/react-vite'
import type {ActionListProps, ActionListGroupProps} from '.'
import {ActionList} from '.'
import {Item} from './Item'
import {LinkItem} from './LinkItem'
import {Group} from './Group'
import {Divider} from './Divider'
import {Description} from './Description'
import {TypographyIcon, VersionsIcon, SearchIcon, ArrowRightIcon, ArrowLeftIcon} from '@primer/octicons-react'

export default {
  title: 'Components/ActionList',
  component: ActionList,
  subcomponents: {Item, LinkItem, Group, Divider, Description},
} as Meta<typeof ActionList>

export const Default = () => (
  <ActionList>
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Quote reply</ActionList.Item>
    <ActionList.Item>Edit comment</ActionList.Item>
  </ActionList>
)

export const Playground: StoryFn<ActionListProps> = args => (
  <ActionList {...args}>
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Quote reply</ActionList.Item>
    <ActionList.Item>Edit comment</ActionList.Item>
  </ActionList>
)
Playground.args = {
  showDividers: false,
  selectionVariant: undefined,
  variant: 'inset',
}
Playground.argTypes = {
  showDividers: {
    control: {
      type: 'boolean',
    },
  },
  variant: {
    control: {
      type: 'radio',
    },
    options: ['inset', 'horizontal-inset', 'full'],
  },
  selectionVariant: {
    control: {
      type: 'radio',
      labels: ['single', 'multiple', 'unset'],
    },
    options: [0, 1, 2],
    mapping: ['single', 'multiple', null],
  },
  role: {
    type: 'string',
  },
}

const icons = ['unset', 'TypographyIcon', 'VersionsIcon', 'SearchIcon', 'ArrowRightIcon', 'ArrowLeftIcon']

// @ts-ignore ignoring types here to pass in options for icon selection in Storybook
export const ItemPlayground = args => {
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
    <ActionList selectionVariant={args.selectionVariant}>
      <ActionList.Item {...args}>
        {leadingVisual && <ActionList.LeadingVisual>{leadingVisual}</ActionList.LeadingVisual>}
        Action list item
        {trailingVisual && <ActionList.TrailingVisual>{trailingVisual}</ActionList.TrailingVisual>}
      </ActionList.Item>
    </ActionList>
  )
}
ItemPlayground.argTypes = {
  selected: {
    control: {
      type: 'boolean',
    },
  },
  active: {
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  inactiveText: {
    control: {
      type: 'text',
    },
  },
  variant: {
    control: 'radio',
    options: ['default', 'danger'],
  },
  size: {
    control: {
      type: 'radio',
    },
    options: ['medium', 'large'],
  },
  role: {
    type: 'string',
  },
  id: {
    type: 'string',
  },
  leadingVisual: {
    control: {
      type: 'select',
    },
    options: icons,
  },
  loading: {
    control: {
      type: 'boolean',
    },
  },
  trailingVisual: {
    control: {
      type: 'select',
    },
    options: icons,
  },
  selectionVariant: {
    control: 'radio',
    if: {arg: 'selected'},
    options: ['single', 'multiple'],
    table: {
      category: 'ActionList',
    },
  },
}
ItemPlayground.args = {
  selected: false,
  active: false,
  disabled: false,
  inactiveText: '',
  variant: 'default',
  size: 'medium',
  id: 'item-1',
  leadingVisual: null,
  loading: false,
  trailingVisual: null,
  selectionVariant: 'single',
}

// @ts-ignore ignoring types here to pass in options for icon selection in Storybook
export const LinkItemPlayground = args => {
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
LinkItemPlayground.args = {
  active: false,
  disabled: false,
  id: 'item-1',
  variant: 'default',
  size: 'medium',
  inactiveText: '',
  leadingVisual: null,
  loading: false,
  trailingVisual: null,
}
LinkItemPlayground.argTypes = {
  active: {
    control: {
      type: 'boolean',
    },
  },
  variant: {
    control: 'radio',
    options: ['default', 'danger'],
  },
  size: {
    control: {
      type: 'radio',
    },
    options: ['medium', 'large'],
  },
  role: {
    type: 'string',
  },
  id: {
    type: 'string',
  },
  inactiveText: {
    control: {
      type: 'text',
    },
  },
  leadingVisual: {
    control: {
      type: 'select',
    },
    options: icons,
  },
  loading: {
    control: {
      type: 'boolean',
    },
  },
  trailingVisual: {
    control: {
      type: 'select',
    },
    options: icons,
  },
  href: {
    type: 'string',
  },
}

export const GroupPlayground: StoryFn<ActionListGroupProps> = args => (
  <ActionList>
    <ActionList.Group {...args}>
      <ActionList.Item>Item 1</ActionList.Item>
      <ActionList.Item>Item 2</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)
GroupPlayground.argTypes = {
  variant: {
    control: {
      type: 'radio',
    },
    options: ['subtle', 'filled'],
  },
  role: {
    type: 'string',
  },
  title: {
    type: 'string',
  },
  'aria-label': {
    type: 'string',
  },
  auxiliaryText: {
    type: 'string',
  },
}
GroupPlayground.args = {
  variant: 'subtle',
  title: 'Group title',
  auxiliaryText: '',
}
