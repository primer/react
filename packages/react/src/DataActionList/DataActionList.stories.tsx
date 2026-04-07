import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {BookIcon, CodeIcon, GearIcon, ShieldLockIcon} from '@primer/octicons-react'
import {ActionList} from '../ActionList'
import {DataActionList} from './DataActionList'
import type {DataActionListProps, DataActionListRow} from './types'

const ReactRouterLikeLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {to: string}
>(({to, ...props}, ref) => <a ref={ref} href={to} {...props} />)

ReactRouterLikeLink.displayName = 'ReactRouterLikeLink'

const baseRows: DataActionListRow[] = [
  {
    kind: 'item',
    key: 'copy-link',
    label: 'Copy link',
    leadingVisual: <CodeIcon />,
    description: {content: 'Copies a permalink to this item.'},
  },
  {
    kind: 'item',
    key: 'configure',
    label: 'Configure',
    leadingVisual: <GearIcon />,
    trailingVisual: <BookIcon />,
  },
  {
    kind: 'link',
    key: 'open-docs',
    label: 'Open docs',
    href: 'https://primer.style/react',
    description: {content: 'Opens Primer React docs in a new tab.'},
    target: '_blank',
    rel: 'noreferrer',
  },
  {kind: 'divider', key: 'divider-1'},
  {
    kind: 'group',
    key: 'danger-group',
    heading: {
      content: 'Danger zone',
      variant: 'filled',
      as: 'h4',
      auxiliaryText: 'Destructive actions',
    },
    rows: [
      {
        kind: 'item',
        key: 'remove-access',
        label: context => `Remove access (${context.indexes.itemIndex + 1})`,
        variant: 'danger',
        leadingVisual: <ShieldLockIcon />,
        description: {
          variant: 'block',
          content: 'This action removes all current access for selected members.',
        },
      },
    ],
  },
]

const meta = {
  title: 'Components/DataActionList',
  component: DataActionList,
} satisfies Meta<typeof DataActionList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: DataActionListProps) => <DataActionList {...args} />,
  args: {
    heading: {as: 'h3', content: 'Data-driven actions'},
    rows: baseRows,
    variant: 'inset',
  },
}

export const SelectableListbox: Story = {
  args: {
    rows: baseRows,
  },
  render: () => {
    const [selectedKey, setSelectedKey] = React.useState('repo-1')

    const rows: DataActionListRow[] = [
      {
        kind: 'item',
        key: 'repo-1',
        label: 'Primer React',
        selected: selectedKey === 'repo-1',
        onSelect: () => setSelectedKey('repo-1'),
      },
      {
        kind: 'item',
        key: 'repo-2',
        label: 'Primer ViewComponents',
        selected: selectedKey === 'repo-2',
        onSelect: () => setSelectedKey('repo-2'),
      },
      {
        kind: 'item',
        key: 'repo-3',
        label: 'Primer Primitives',
        selected: selectedKey === 'repo-3',
        onSelect: () => setSelectedKey('repo-3'),
      },
    ]

    return <DataActionList role="listbox" selectionVariant="single" aria-label="Select repository" rows={rows} />
  },
}

export const ActionListParityReference: Story = {
  args: {
    rows: baseRows,
  },
  render: () => (
    <div style={{display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'}}>
      <div>
        <h3>ActionList</h3>
        <ActionList aria-label="ActionList reference">
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <CodeIcon />
            </ActionList.LeadingVisual>
            Copy link
            <ActionList.Description>Copies a permalink to this item.</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <GearIcon />
            </ActionList.LeadingVisual>
            Configure
            <ActionList.TrailingVisual>
              <BookIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.LinkItem href="https://primer.style/react" target="_blank" rel="noreferrer">
            Open docs
            <ActionList.Description>Opens Primer React docs in a new tab.</ActionList.Description>
          </ActionList.LinkItem>
          <ActionList.Divider />
          <ActionList.Group>
            <ActionList.GroupHeading as="h4" variant="filled" auxiliaryText="Destructive actions">
              Danger zone
            </ActionList.GroupHeading>
            <ActionList.Item variant="danger">
              <ActionList.LeadingVisual>
                <ShieldLockIcon />
              </ActionList.LeadingVisual>
              Remove access
              <ActionList.Description variant="block">
                This action removes all current access for selected members.
              </ActionList.Description>
            </ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </div>

      <div>
        <h3>DataActionList</h3>
        <DataActionList
          heading={{as: 'h3', content: 'Data-driven actions'}}
          rows={baseRows}
          aria-label="DataActionList"
        />
      </div>
    </div>
  ),
}

export const InactiveAndLoadingEdgeCases: Story = {
  args: {
    rows: baseRows,
  },
  render: () => {
    const rows: DataActionListRow[] = [
      {
        kind: 'item',
        key: 'inactive-leading',
        label: 'Inactive with leading visual',
        inactiveText: 'Unavailable due to an outage',
        leadingVisual: <CodeIcon />,
      },
      {
        kind: 'item',
        key: 'inactive-trailing',
        label: 'Inactive with trailing visual',
        inactiveText: 'Pending backend migration',
        trailingVisual: <BookIcon />,
      },
      {
        kind: 'item',
        key: 'loading-item',
        label: 'Loading item',
        loading: true,
      },
      {
        kind: 'item',
        key: 'inactive-and-loading',
        label: 'Inactive and loading',
        loading: true,
        inactiveText: 'Service outage: retry later',
      },
      {
        kind: 'link',
        key: 'inactive-link',
        label: 'Inactive link row',
        href: 'https://primer.style',
        inactiveText: 'Permission required',
      },
    ]

    return <DataActionList aria-label="Inactive and loading edge cases" rows={rows} />
  },
}

export const MixedDescriptionsEdgeCases: Story = {
  args: {
    rows: baseRows,
  },
  render: () => {
    const rows: DataActionListRow[] = [
      {
        kind: 'item',
        key: 'inline-description',
        label: 'Inline description',
        description: {content: 'Description stays inline'},
      },
      {
        kind: 'item',
        key: 'block-description',
        label: 'Block description',
        description: {
          variant: 'block',
          content: 'Block description is below label and should wire through aria-describedby.',
        },
      },
      {
        kind: 'item',
        key: 'truncated-inline',
        label: 'Inline + truncate',
        description: {
          truncate: true,
          content: 'A very long inline description that should trigger truncation and tooltip handling when needed.',
        },
      },
      {
        kind: 'group',
        key: 'mixed-group',
        heading: {as: 'h4', content: 'Grouped mix'},
        rows: [
          {
            kind: 'item',
            key: 'group-item-no-description',
            label: 'No description',
          },
          {
            kind: 'link',
            key: 'group-link-block-description',
            label: 'Link with block description',
            href: 'https://primer.style/react/ActionList',
            description: {variant: 'block', content: 'Uses link semantics with block secondary text.'},
          },
        ],
      },
    ]

    return <DataActionList aria-label="Mixed descriptions edge cases" rows={rows} />
  },
}

export const ListboxGroupSelectionOverrideEdgeCases: Story = {
  args: {
    rows: baseRows,
  },
  render: () => {
    const [selectedKey, setSelectedKey] = React.useState('alpha')

    const rows: DataActionListRow[] = [
      {
        kind: 'group',
        key: 'group-without-selection-markers',
        selectionVariant: false,
        heading: {content: 'No selection marker group'},
        rows: [
          {
            kind: 'item',
            key: 'alpha',
            label: 'Alpha',
            selected: selectedKey === 'alpha',
            onSelect: () => setSelectedKey('alpha'),
          },
          {
            kind: 'item',
            key: 'beta',
            label: 'Beta',
            selected: selectedKey === 'beta',
            onSelect: () => setSelectedKey('beta'),
          },
        ],
      },
      {
        kind: 'group',
        key: 'group-with-default-selection',
        heading: {content: 'Default selection marker group'},
        rows: [
          {
            kind: 'item',
            key: 'gamma',
            label: 'Gamma',
            selected: selectedKey === 'gamma',
            onSelect: () => setSelectedKey('gamma'),
          },
          {
            kind: 'item',
            key: 'delta',
            label: 'Delta',
            selected: selectedKey === 'delta',
            onSelect: () => setSelectedKey('delta'),
          },
        ],
      },
    ]

    return (
      <DataActionList
        role="listbox"
        selectionVariant="single"
        aria-label="Listbox selection override edge cases"
        rows={rows}
      />
    )
  },
}

export const RenderContextEdgeCases: Story = {
  args: {
    rows: baseRows,
  },
  render: () => {
    const [selectedKey, setSelectedKey] = React.useState('ctx-1')

    const rows: DataActionListRow[] = [
      {
        kind: 'item',
        key: 'ctx-1',
        label: context => `Item ${context.indexes.itemIndex} (${context.ids.itemId})`,
        selected: selectedKey === 'ctx-1',
        onSelect: (_event, context) => {
          setSelectedKey(context.item.key)
        },
        description: {
          render: context => `labelId=${context.ids.labelId}`,
        },
      },
      {
        kind: 'link',
        key: 'ctx-link',
        href: 'https://primer.style/react',
        label: context => `Link ${context.indexes.itemIndex} (${context.ids.itemId})`,
        description: {
          render: context => `trailingVisualId=${context.ids.trailingVisualId}`,
        },
      },
    ]

    return (
      <DataActionList
        heading={{
          as: 'h3',
          render: context => `Render context heading (role: ${context.role ?? 'list'})`,
        }}
        rows={rows}
        selectionVariant="single"
        role="listbox"
        aria-label="Render context edge cases"
      />
    )
  },
}

export const TrailingActionEdgeCases: Story = {
  args: {
    rows: baseRows,
  },
  render: () => {
    const rows: DataActionListRow[] = [
      {
        kind: 'item',
        key: 'button-trailing-action',
        label: 'Button trailing action',
        trailingAction: {
          icon: BookIcon,
          label: 'Open details',
        },
      },
      {
        kind: 'item',
        key: 'link-trailing-action',
        label: 'Link trailing action',
        trailingAction: {
          as: 'a',
          href: 'https://primer.style/react',
          icon: BookIcon,
          label: 'Open docs',
        },
      },
      {
        kind: 'link',
        key: 'plain-link-row',
        label: 'Plain link row',
        href: 'https://primer.style/react/ActionList',
      },
    ]

    return <DataActionList aria-label="Trailing action edge cases" rows={rows} />
  },
}

export const RouterLinkComposition: Story = {
  args: {
    rows: baseRows,
  },
  render: () => {
    const rows: DataActionListRow[] = [
      {
        kind: 'link',
        key: 'router-link-default',
        as: ReactRouterLikeLink,
        label: 'Navigate with router component',
        linkProps: {
          to: '?path=/story/components-dataactionlist--default',
          'data-router-link': 'true',
        },
        description: {
          content: 'Uses DataActionList link row with as + linkProps (ActionList.LinkItem parity).',
        },
      },
      {
        kind: 'link',
        key: 'router-link-with-fallback-href',
        as: ReactRouterLikeLink,
        href: '/fallback',
        label: 'Router component with fallback href',
        linkProps: {
          to: '?path=/story/components-dataactionlist--selectable-listbox',
        },
      },
    ]

    return <DataActionList aria-label="Router link composition" rows={rows} />
  },
}
