import {LinkIcon, StarIcon, TableIcon, XIcon} from '@primer/octicons-react'
import React, {useEffect, useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {Banner} from '../Banner'
import {FormControl} from '../FormControl'
import {TextInput} from '../TextInput'
import {ActionList} from './ActionList'

const meta = {
  title: 'React Tailwind/Components/ActionList/Examples',
  component: ActionList,
} satisfies Meta<typeof ActionList>

export default meta
type Story = StoryObj<typeof meta>

export const ListLinkItem: Story = {
  render: () => (
    <ActionList showDividers>
      <ActionList.Item>
        <ActionList.LeadingVisual>
          <XIcon />
        </ActionList.LeadingVisual>
        not a link, just an Item for comparison
      </ActionList.Item>
      <ActionList.LinkItem aria-keyshortcuts="g" href="https://github.com/primer">
        <ActionList.LeadingVisual>
          <LinkIcon />
        </ActionList.LeadingVisual>
        ActionList.LinkItem
      </ActionList.LinkItem>
      <ActionList.LinkItem href="https://github.com/primer" target="_blank" rel="noopener noreferrer">
        <ActionList.LeadingVisual>
          <LinkIcon />
        </ActionList.LeadingVisual>
        ActionList.LinkItem with anchor attributes
      </ActionList.LinkItem>
      <ActionList.LinkItem href="?path=/story/components-actionlist--default">
        <ActionList.LeadingVisual>
          <LinkIcon />
        </ActionList.LeadingVisual>
        as ReactRouterLink
      </ActionList.LinkItem>
      <ActionList.LinkItem href="?path=/story/components-actionlist--default">
        <ActionList.LeadingVisual>
          <LinkIcon />
        </ActionList.LeadingVisual>
        NextJS style Link
      </ActionList.LinkItem>
      <ActionList.LinkItem href="?path=/story/components-actionlist--default">
        <ActionList.LeadingVisual>
          <LinkIcon />
        </ActionList.LeadingVisual>
        With inline description <ActionList.Description>inline description</ActionList.Description>
      </ActionList.LinkItem>
      <ActionList.LinkItem href="?path=/story/components-actionlist--default">
        <ActionList.LeadingVisual>
          <LinkIcon />
        </ActionList.LeadingVisual>
        With block description <ActionList.Description variant="block">Block description</ActionList.Description>
      </ActionList.LinkItem>
      <ActionList.LinkItem href="?path=/story/components-actionlist--default">
        <ActionList.LeadingVisual>
          <LinkIcon />
        </ActionList.LeadingVisual>
        Trailing visual <ActionList.TrailingVisual>⌘ + L</ActionList.TrailingVisual>
      </ActionList.LinkItem>
    </ActionList>
  ),
}
ListLinkItem.storyName = 'Link Item'

const branches = [
  'main',
  'composable-dropdown',
  'exports',
  'label-to-beta',
  'reexport-behaviors',
  'changeset-release/main',
  'dependabot/npm_and_yarn/docs/engine.io-4.1.2',
  'ci-order',
  'mdx-components',
  'emoji-picker-api',
]

export const MixedSelection: Story = {
  render: () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(1)
    const options = ['Status', 'Stage', 'Assignee', 'Team', 'Estimate', 'Due Date']

    return (
      <>
        <h1>List with mixed selection</h1>
        <p>
          In this list, there is a ActionList.Group with single selection for picking one option, followed by a Item
          that is an action. This pattern appears inside a menu for selection view options in Memex
        </p>
        <ActionList role="listbox" aria-label="View options">
          <ActionList.Group selectionVariant="single">
            <ActionList.GroupHeading>Group by</ActionList.GroupHeading>
            {options.map((option, index) => (
              <ActionList.Item
                key={option}
                role="option"
                selected={index === selectedIndex}
                onSelect={() => setSelectedIndex(index)}
              >
                <ActionList.LeadingVisual aria-hidden="true">◆</ActionList.LeadingVisual>
                {option}
              </ActionList.Item>
            ))}
          </ActionList.Group>
          {selectedIndex !== null ? (
            <>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => setSelectedIndex(null)}>
                <ActionList.LeadingVisual aria-hidden="true">×</ActionList.LeadingVisual>
                Clear Group by
              </ActionList.Item>
            </>
          ) : null}
        </ActionList>
      </>
    )
  },
}

export const MixedSelectionInteractive: Story = {
  ...MixedSelection,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('option', {name: /Status/})
    await userEvent.click(status)
    await expect(status).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(canvas.getByRole('option', {name: 'Clear Group by'}))
    await expect(canvas.queryByRole('option', {name: 'Clear Group by'})).not.toBeInTheDocument()
  },
}

export const AsyncListWithSpinner: Story = {
  render: () => {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState(branches.slice(0, 6))
    const [selected, setSelected] = useState('main')

    useEffect(() => {
      if (!query) {
        setResults(branches.slice(0, 6))
        setLoading(false)
        return
      }

      setLoading(true)
      const timeout = window.setTimeout(() => {
        setResults(branches.filter(name => name.includes(query)).slice(0, 6))
        setLoading(false)
      }, 100)
      return () => window.clearTimeout(timeout)
    }, [query])

    return (
      <>
        <h1>Async List</h1>
        <p>
          This pattern has an ActionList with single selection, the contents of which can change asynchronously through
          a filter. This pattern can be found in branch selection menus via the SelectPanel component.
        </p>
        <FormControl className="mx-2 mb-0">
          <FormControl.Label>Search branches</FormControl.Label>
          <TextInput className="w-full" value={query} onChange={event => setQuery(event.target.value)} />
        </FormControl>
        <div role="status" aria-live="polite" className="sr-only">
          {loading
            ? 'Loading results'
            : !query
              ? 'Showing top 6 branches'
              : results.length === 0
                ? 'No branches match that query'
                : `Branches filtered, showing ${results.length} branches`}
        </div>
        <ActionList className="h-52 overflow-auto" selectionVariant="single" role="listbox" aria-label="Branch">
          {loading ? (
            <ActionList.Item disabled>Loading results…</ActionList.Item>
          ) : (
            results.map(name => (
              <ActionList.Item key={name} role="option" selected={selected === name} onSelect={() => setSelected(name)}>
                {name}
              </ActionList.Item>
            ))
          )}
        </ActionList>
      </>
    )
  },
}

export const AsyncListWithSpinnerInteractive: Story = {
  ...AsyncListWithSpinner,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Search branches'), 'no-such-branch')
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('No branches match that query'))
  },
}

export const AllCombinations: Story = {
  render: () => {
    const items = [
      {label: 'The everything bagel', leading: true, inline: true, block: true, trailing: true},
      {label: 'none of them, only text'},
      {label: 'only L', leading: true},
      {label: 'only I', inline: true},
      {label: 'only B', block: true},
      {label: 'only T', trailing: true},
      {label: 'L + I', leading: true, inline: true},
      {label: 'L + B', leading: true, block: true},
      {label: 'L + T', leading: true, trailing: true},
      {label: 'I + B', inline: true, block: true},
      {label: 'I + T', inline: true, trailing: true},
      {label: 'B + T', block: true, trailing: true},
      {label: 'L + I + B', leading: true, inline: true, block: true},
      {label: 'L + I + T', leading: true, inline: true, trailing: true, disabled: true},
      {label: 'L + B + T', leading: true, block: true, trailing: true, disabled: true},
      {label: 'I + B + T', inline: true, block: true, trailing: true, disabled: true},
      {label: 'L + B + T', block: true, inactive: true},
      {label: 'L + B + T', inline: true, inlineText: 'Inline description', inactive: true},
      {label: 'L + I + T', leading: true, inline: true, trailing: true, inactive: true},
      {label: 'L + B + T', leading: true, block: true, trailing: true, inactive: true},
      {label: 'L + B + T', block: true, trailing: true, inactive: true},
      {label: 'I + B + T', inline: true, block: true, trailing: true, inactive: true},
      {label: 'L + B + T', block: true, loading: true},
      {label: 'L + B + T', inline: true, loading: true},
      {label: 'L + I + T', leading: true, inline: true, trailing: true, loading: true},
      {label: 'L + B + T', leading: true, block: true, trailing: true, loading: true},
      {label: 'L + B + T', block: true, trailing: true, loading: true},
      {label: 'I + B + T', inline: true, block: true, trailing: true, loading: true},
      {label: 'Danger', leading: true, inline: true, block: true, trailing: true, danger: true},
    ]

    return (
      <>
        <h1>All Possible Combinations</h1>
        <code>
          dynamic features: L = Leading Visual, I = Inline Description, B = Block Description, T = Trailing Visual
        </code>
        <br />
        <code>16 possible combinations</code>
        <br />
        <br />
        <div className="max-w-[300px]">
          <ActionList showDividers>
            {items.map((item, index) => (
              <ActionList.Item
                key={`${item.label}-${index}`}
                disabled={item.disabled}
                inactiveText={item.inactive ? 'Unavailable due to an outage' : undefined}
                loading={item.loading}
                loadingText={item.loading ? 'Loading' : undefined}
                variant={item.danger ? 'danger' : 'default'}
              >
                {item.leading ? (
                  <ActionList.LeadingVisual>
                    <StarIcon />
                  </ActionList.LeadingVisual>
                ) : null}
                {item.label}
                {item.inline ? (
                  <ActionList.Description variant="inline">
                    {'inlineText' in item ? item.inlineText : 'inline description'}
                  </ActionList.Description>
                ) : null}
                {item.block && !item.inline ? (
                  <ActionList.Description variant="block">Block description</ActionList.Description>
                ) : null}
                {item.trailing ? (
                  <ActionList.TrailingVisual>
                    <StarIcon />
                  </ActionList.TrailingVisual>
                ) : null}
              </ActionList.Item>
            ))}
          </ActionList>
        </div>
      </>
    )
  },
}

export const AllCombinationsInteractive: Story = {
  ...AllCombinations,
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('The everything bagel')).toBeVisible()
  },
}

export const CustomTreeRole: Story = {
  render: function CustomTreeRoleStory() {
    const projects = [
      {name: 'Primer Backlog', scope: 'GitHub'},
      {name: 'Accessibility', scope: 'GitHub'},
      {name: 'Octicons', scope: 'github/primer'},
      {name: 'Primer React', scope: 'github/primer'},
    ]
    const [selectedIndices, setSelectedIndices] = React.useState([0])
    const handleSelect = (index: number) => {
      setSelectedIndices(current =>
        current.includes(index) ? current.filter(selected => selected !== index) : [...current, index],
      )
    }

    return (
      <>
        <Banner
          description="This story is for demonstration purposes only. For most use cases, you probably want to use the default list roles provided by ActionList. Overriding default roles may have accessibility implications, so be sure to consult with an accessibility expert if you need to use custom roles."
          title="Demonstration only"
          variant="warning"
        />
        <ActionList aria-label="Projects" aria-multiselectable="true" role="tree" selectionVariant="multiple">
          {projects.map((project, index) => (
            <ActionList.Item
              key={project.name}
              onSelect={() => handleSelect(index)}
              role="treeitem"
              selected={selectedIndices.includes(index)}
            >
              <ActionList.LeadingVisual>
                <TableIcon />
              </ActionList.LeadingVisual>
              {project.name}
              <ActionList.Description variant="block">{project.scope}</ActionList.Description>
            </ActionList.Item>
          ))}
        </ActionList>
      </>
    )
  },
}
