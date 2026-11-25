import {GitBranchIcon, TagIcon, TriangleDownIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {ActionList} from '../ActionList'
import {UnderlinePanels} from '../experimental'
import Label from '../Label'
import {SelectPanel, type SelectPanelValue} from '../SelectPanel'
import classes from './SelectPanel.ref-selector.stories.module.css'

const refTypes = [
  {
    value: 'branch',
    label: 'Branches',
    placeholder: 'Find or create a branch...',
    href: 'https://github.com/primer/react/branches',
    names: [
      'main',
      'mattcosta7-breadcrumbs-resize-perf',
      'mattcosta7-actionlist-treeview-invalidation-fix',
      'liuliu/fix-selectpanel-announcement',
      'joshfarrant/segmentedcontrol-reintroduction',
      'joshfarrant/impeccable',
      'joshfarrant/detached-anchor-aria-fix',
      'joshblack/react-compiler-token-remove-button',
    ],
  },
  {
    value: 'tag',
    label: 'Tags',
    placeholder: 'Search or create a new tag',
    href: 'https://github.com/primer/react/tags',
    names: [
      'v36.14.0',
      'v36.7.1',
      'v36.7.0',
      'v36.6.0',
      'v36.5.0',
      'v36.4.0',
      'v36.3.1',
      'v36.3.0',
      'v36.2.0',
      'v36.1.0',
    ],
  },
] as const

export function RefSelectorExample() {
  const [open, setOpen] = useState(false)
  const [refType, setRefType] = useState('branch')
  const [selected, setSelected] = useState<SelectPanelValue[]>(['branch:main'])
  const [filter, setFilter] = useState('')
  const selectedType = refTypes.find(type => type.names.some(name => selected.includes(`${type.value}:${name}`)))!
  const selectedName = selectedType.names.find(name => selected.includes(`${selectedType.value}:${name}`))!
  const activeType = refTypes.find(type => type.value === refType)!
  const query = filter.trim().toLowerCase()

  return (
    <SelectPanel.Root
      open={open}
      onOpenChange={nextOpen => {
        if (nextOpen) {
          setFilter('')
          setRefType(selectedType.value)
        }
        setOpen(nextOpen)
      }}
      selectionMode="single"
      closeOnSelect
      selected={selected}
      onSelectedChange={values => {
        // A repository always has a current ref, even when its selected row is activated again.
        if (values.length > 0) setSelected(values)
      }}
      filterValue={filter}
      onFilterChange={setFilter}
    >
      <SelectPanel.Trigger
        leadingVisual={selectedType.value === 'branch' ? GitBranchIcon : TagIcon}
        trailingAction={TriangleDownIcon}
      >
        {selectedName}
      </SelectPanel.Trigger>
      <SelectPanel.Overlay width="medium" height="auto" overlayProps={{maxHeight: 'xlarge'}}>
        <SelectPanel.Content className={classes.Content}>
          <SelectPanel.Header className={classes.Header}>
            <SelectPanel.Title>Switch branches/tags</SelectPanel.Title>
            <SelectPanel.CloseButton />
          </SelectPanel.Header>
          <SelectPanel.SearchInput aria-label="Find a branch or tag" placeholder={activeType.placeholder} />
          <UnderlinePanels
            aria-label="Ref type"
            className={classes.Tabs}
            value={refType}
            onChange={({value}) => setRefType(value)}
          >
            {refTypes.map(type => (
              <UnderlinePanels.Tab key={type.value} value={type.value}>
                {type.label}
              </UnderlinePanels.Tab>
            ))}
            {refTypes.map(type => {
              const results = type.names.filter(name => name.toLowerCase().includes(query))
              return (
                <UnderlinePanels.Panel key={type.value} value={type.value} className={classes.TabPanel}>
                  {refType === type.value ? (
                    results.length > 0 ? (
                      <SelectPanel.List aria-label={type.label} className={classes.List}>
                        {results.map(name => (
                          <SelectPanel.Item key={name} value={`${type.value}:${name}`}>
                            {name}
                            {type.value === 'branch' && name === 'main' ? (
                              // eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item forwards ActionList slots.
                              <ActionList.TrailingVisual>
                                <Label>default</Label>
                              </ActionList.TrailingVisual>
                            ) : null}
                          </SelectPanel.Item>
                        ))}
                      </SelectPanel.List>
                    ) : (
                      <SelectPanel.Message variant="empty" title={`No ${type.label.toLowerCase()} found`} size="inline">
                        Try a different name.
                      </SelectPanel.Message>
                    )
                  ) : null}
                </UnderlinePanels.Panel>
              )
            })}
          </UnderlinePanels>
          <SelectPanel.Footer className={classes.Footer}>
            <ActionList className={classes.FooterList}>
              <ActionList.LinkItem href={activeType.href}>
                View all {activeType.label.toLowerCase()}
              </ActionList.LinkItem>
            </ActionList>
          </SelectPanel.Footer>
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

const meta = {
  title: 'Components/SelectPanel/Composition/RefSelector',
  component: SelectPanel.Root,
  excludeStories: ['RefSelectorExample'],
  parameters: {
    controls: {disable: true},
  },
} satisfies Meta<typeof SelectPanel.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <RefSelectorExample />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', {name: 'main'}))
    const search = await body.findByRole('combobox', {name: 'Find a branch or tag'})
    await waitFor(() => expect(search).toHaveFocus())
    await userEvent.click(body.getByRole('tab', {name: /^Tags\b/}))
    await userEvent.type(search, 'v36.7')
    await waitFor(() => expect(body.getAllByRole('option')).toHaveLength(2))
    await userEvent.keyboard('{PageUp}')
    await waitFor(() =>
      expect(search).toHaveAttribute('aria-activedescendant', body.getByRole('option', {name: 'v36.7.1'}).id),
    )
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(canvas.getByRole('button', {name: 'v36.7.1'})).toHaveFocus()
  },
  parameters: {
    docs: {
      description: {
        story:
          'A branch/tag picker composed entirely from the existing SelectPanel API and UnderlinePanels, with repository navigation in a separate footer ActionList. Search, the active tab, and the current ref are application-owned. Static fixtures demonstrate filtering and single selection; branch/tag creation and repository requests are intentionally out of scope.',
      },
    },
  },
}
