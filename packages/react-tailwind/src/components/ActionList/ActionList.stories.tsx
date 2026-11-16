import {ArrowLeftIcon, ArrowRightIcon, SearchIcon, TypographyIcon, VersionsIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  ActionList,
  type ActionListGroupProps,
  type ActionListItemProps,
  type ActionListLinkItemProps,
  type ActionListRootProps,
} from './ActionList'

const meta = {
  title: 'React Tailwind/Components/ActionList',
  component: ActionList,
} satisfies Meta<typeof ActionList>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <ActionList>
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Quote reply</ActionList.Item>
      <ActionList.Item>Edit comment</ActionList.Item>
    </ActionList>
  ),
}
export const Playground: StoryObj<ActionListRootProps> = {
  render: args => (
    <ActionList {...args}>
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Quote reply</ActionList.Item>
      <ActionList.Item>Edit comment</ActionList.Item>
    </ActionList>
  ),
  args: {
    showDividers: false,
    selectionVariant: undefined,
    variant: 'inset',
  },
  argTypes: {
    showDividers: {control: {type: 'boolean'}},
    variant: {control: {type: 'radio'}, options: ['inset', 'horizontal-inset', 'full']},
    selectionVariant: {
      control: {type: 'radio', labels: ['single', 'multiple', 'unset']},
      options: [0, 1, 2],
      mapping: ['single', 'multiple', null],
    },
    role: {control: {type: 'text'}},
  },
}

const icons = ['unset', 'TypographyIcon', 'VersionsIcon', 'SearchIcon', 'ArrowRightIcon', 'ArrowLeftIcon'] as const
type IconName = (typeof icons)[number]
const iconComponents = {TypographyIcon, VersionsIcon, SearchIcon, ArrowRightIcon, ArrowLeftIcon}

function renderIcon(name: IconName | null | undefined) {
  if (!name || name === 'unset') return null
  const Icon = iconComponents[name]
  return <Icon />
}

interface VisualArgs {
  leadingVisual?: IconName | null
  trailingVisual?: IconName | null
}

type ItemPlaygroundArgs = Omit<ActionListItemProps, 'leadingVisual' | 'trailingVisual'> &
  VisualArgs & {selectionVariant?: 'single' | 'multiple'}

export const ItemPlayground: StoryObj<ItemPlaygroundArgs> = {
  render: ({leadingVisual, selectionVariant, trailingVisual, ...args}) => {
    const leadingIcon = renderIcon(leadingVisual)
    const trailingIcon = renderIcon(trailingVisual)
    return (
      <ActionList selectionVariant={selectionVariant}>
        <ActionList.Item {...args}>
          {leadingIcon && <ActionList.LeadingVisual>{leadingIcon}</ActionList.LeadingVisual>}
          Action list item
          {trailingIcon && <ActionList.TrailingVisual>{trailingIcon}</ActionList.TrailingVisual>}
        </ActionList.Item>
      </ActionList>
    )
  },
  args: {
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
  },
  argTypes: {
    selected: {control: {type: 'boolean'}},
    active: {control: {type: 'boolean'}},
    disabled: {control: {type: 'boolean'}},
    inactiveText: {control: {type: 'text'}},
    variant: {control: 'radio', options: ['default', 'danger']},
    size: {control: {type: 'radio'}, options: ['small', 'medium', 'large']},
    role: {control: 'text'},
    id: {control: 'text'},
    leadingVisual: {control: {type: 'select'}, options: icons},
    loading: {control: {type: 'boolean'}},
    trailingVisual: {control: {type: 'select'}, options: icons},
    selectionVariant: {
      control: 'radio',
      if: {arg: 'selected'},
      options: ['single', 'multiple'],
      table: {category: 'ActionList'},
    },
  },
}

type LinkItemPlaygroundArgs = Omit<ActionListLinkItemProps, 'leadingVisual' | 'trailingVisual'> &
  VisualArgs & {disabled?: boolean; loading?: boolean}

export const LinkItemPlayground: StoryObj<LinkItemPlaygroundArgs> = {
  // `disabled` and `loading` mirror the upstream controls but don't apply to a link.
  render: ({disabled: _disabled, leadingVisual, loading: _loading, trailingVisual, ...args}) => {
    const leadingIcon = renderIcon(leadingVisual)
    const trailingIcon = renderIcon(trailingVisual)
    return (
      <ActionList>
        <ActionList.LinkItem {...args}>
          {leadingIcon && <ActionList.LeadingVisual>{leadingIcon}</ActionList.LeadingVisual>}
          Action list item
          {trailingIcon && <ActionList.TrailingVisual>{trailingIcon}</ActionList.TrailingVisual>}
        </ActionList.LinkItem>
      </ActionList>
    )
  },
  args: {
    active: false,
    disabled: false,
    id: 'item-1',
    variant: 'default',
    size: 'medium',
    inactiveText: '',
    leadingVisual: null,
    loading: false,
    trailingVisual: null,
  },
  argTypes: {
    active: {control: {type: 'boolean'}},
    variant: {control: 'radio', options: ['default', 'danger']},
    size: {control: {type: 'radio'}, options: ['small', 'medium', 'large']},
    role: {control: 'text'},
    id: {control: 'text'},
    inactiveText: {control: {type: 'text'}},
    leadingVisual: {control: {type: 'select'}, options: icons},
    loading: {control: {type: 'boolean'}},
    trailingVisual: {control: {type: 'select'}, options: icons},
    href: {control: 'text'},
  },
}

export const GroupPlayground: StoryObj<ActionListGroupProps> = {
  render: args => (
    <ActionList>
      <ActionList.Group {...args}>
        <ActionList.Item>Item 1</ActionList.Item>
        <ActionList.Item>Item 2</ActionList.Item>
      </ActionList.Group>
    </ActionList>
  ),
  args: {
    title: 'Group title',
  },
  argTypes: {
    role: {control: 'text'},
    title: {control: 'text'},
    'aria-label': {control: 'text'},
  },
}
