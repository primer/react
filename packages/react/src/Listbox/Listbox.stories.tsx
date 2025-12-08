import type {Meta, StoryFn} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {Listbox} from '.'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import {FilteredActionList} from '../FilteredActionList'
import {Combobox} from '../Combobox'
import React from 'react'
import {
  BookIcon,
  FileCodeIcon,
  FileDirectoryIcon,
  FileIcon,
  FileZipIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitCompareIcon,
  HeadingIcon,
  InfoIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
  MarkdownIcon,
  PencilIcon,
} from '@primer/octicons-react'
import {ParagraphIcon} from '@storybook/icons'
import {ActionList} from '../ActionList'

export default {
  title: 'Components/Listbox',
  component: Listbox,
} as Meta<ComponentProps<typeof Listbox>>

export const Playground: StoryFn<ComponentProps<typeof Listbox>> = args => <Listbox {...args} />

Playground.argTypes = {
  ref: {
    control: false,
    table: {
      disable: true,
    },
  },
}

const items = [
  {text: 'enhancement', id: 1},
  {text: 'bug', id: 2},
  {text: 'good first issue', id: 3},
  {text: 'design', id: 4},
  {text: 'blocker', id: 5},
  {text: 'backend', id: 6},
  {text: 'frontend', id: 7},
]

export const Default = () => {
  return (
    <div>
      <AnchoredOverlay open={true} renderAnchor={props => <Button {...props}>Open Overlay</Button>}>
        <FilteredActionList items={items} onFilterChange={() => {}} />
        <div>
          <Button variant="primary">Submit</Button>
        </div>
      </AnchoredOverlay>
    </div>
  )
}

export const CustomText = () => <Listbox>Custom text content</Listbox>

export const ListboxExample = () => (
  <Listbox>
    <Listbox.Item>Item 1</Listbox.Item>
    <Listbox.Item>Item 2</Listbox.Item>
    <Listbox.Item>Item 3</Listbox.Item>
  </Listbox>
)

export const ListboxInOverlay = () => {
  const [submenuOpen, setSubmenuOpen] = React.useState(false)
  const [informationSubmenuOpen, setInformationSubmenuOpen] = React.useState(false)
  const listboxRef = React.useRef<HTMLUListElement>(null)
  const trailingRef = React.useRef<HTMLButtonElement>(null)
  const trailingRef2 = React.useRef<HTMLButtonElement>(null)

  // TODO:
  // * Ensure that aria-activedescendant is being set on ComboboxInput when navigating options [Done]
  // * Ensure that AnchoredOverlay is replaced by Combobox.Root [Done]
  // * Ensure that Combobox.Title is linked to Listbox/Input in terms of accessible name/description
  // * Ensure that roving tabindex works correctly with Combobox.Input and Listbox options

  return (
    <div>
      <Combobox.Root
        renderAnchor={props => {
          return <Button {...props}>Open Combobox</Button>
        }}
        focusMode="roving"
      >
        <Combobox.Root
          open={informationSubmenuOpen}
          anchorId="informationSubMenu"
          anchorRef={trailingRef2}
          side="outside-right"
          renderAnchor={null}
          width="medium"
          focusMode="roving"
          anchoredOverlayProps={{
            overlayProps: {
              onClickOutside: () => {
                setInformationSubmenuOpen(false)
              },
              onEscape: () => {
                setInformationSubmenuOpen(false)
              },
            },
          }}
        >
          <Combobox.Title title="File type / Choose a file type" subtitle="Supported file types" />
          <Listbox>
            <Listbox.Item leadingVisual={BookIcon}>Sub Item 1</Listbox.Item>
            <Listbox.Item leadingVisual={HeadingIcon}>Sub Item 2</Listbox.Item>
            <Listbox.Item leadingVisual={FileIcon}>Sub Item 3</Listbox.Item>
          </Listbox>
        </Combobox.Root>
        <Combobox.Title title="Choose an option" subtitle="Options are filtered as you type" />
        <Combobox.Input listboxRef={listboxRef} />
        <Listbox ref={listboxRef}>
          <Listbox.Group groupLabel="Group 1">
            <Listbox.Item leadingVisual={GitBranchIcon}>
              Overlay Item 1
              <ActionList.TrailingAction
                label="Additional Information"
                icon={InfoIcon}
                onClick={() => {
                  setInformationSubmenuOpen(!informationSubmenuOpen)
                }}
                ref={trailingRef2}
              />
            </Listbox.Item>
            <Listbox.Item leadingVisual={GitCommitIcon}>Overlay Item 2</Listbox.Item>
            <Listbox.Item leadingVisual={GitCompareIcon}>Overlay Item 3</Listbox.Item>
          </Listbox.Group>
          <Listbox.Group groupLabel="Group 2">
            <Listbox.Item leadingVisual={PencilIcon}>Overlay Item 4</Listbox.Item>
            <Listbox.Item leadingVisual={MarkdownIcon}>Overlay Item 5</Listbox.Item>
            <Listbox.Item leadingVisual={HeadingIcon}>Overlay Item 6</Listbox.Item>
          </Listbox.Group>
          <Listbox.Group groupLabel="Group 3">
            <Listbox.Item leadingVisual={ListUnorderedIcon}>Overlay Item 7</Listbox.Item>
            <Listbox.Item leadingVisual={ListOrderedIcon}>Overlay Item 8</Listbox.Item>
            <Listbox.Item leadingVisual={ParagraphIcon}>Overlay Item 9</Listbox.Item>
          </Listbox.Group>
          <Listbox.Group groupLabel="Group 4">
            <Listbox.Item leadingVisual={FileDirectoryIcon}>
              Overlay Item 1
              <ActionList.TrailingAction
                ref={trailingRef}
                label="Some action 1"
                icon={InfoIcon}
                onClick={() => {
                  setSubmenuOpen(!submenuOpen)
                }}
              />
            </Listbox.Item>
          </Listbox.Group>
        </Listbox>
      </Combobox.Root>
      <AnchoredOverlay
        open={submenuOpen}
        anchorId="testing"
        anchorRef={trailingRef}
        side="outside-right"
        renderAnchor={null}
        width="medium"
        anchorOffset={10}
        overlayProps={{
          onClickOutside: () => {
            setSubmenuOpen(false)
          },
          onEscape: () => {
            setSubmenuOpen(false)
          },
        }}
      >
        <Combobox.Title title="File type / Choose a file type" subtitle="Supported file types" />
        <Listbox>
          <Listbox.Item leadingVisual={FileIcon}>Sub Item 1</Listbox.Item>
          <Listbox.Item leadingVisual={FileZipIcon}>Sub Item 2</Listbox.Item>
          <Listbox.Item leadingVisual={FileCodeIcon}>Sub Item 3</Listbox.Item>
        </Listbox>
      </AnchoredOverlay>
    </div>
  )
}

export const ListboxInOverlayFilter = () => {
  const [submenuOpen, setSubmenuOpen] = React.useState(false)
  const [filterValue, setFilterValue] = React.useState('') // Add filter state
  const listboxRef = React.useRef<HTMLUListElement>(null)
  const trailingRef = React.useRef<HTMLButtonElement>(null)

  // Define your items array
  const allItems = [
    {
      id: 1,
      text: 'Branch Item 1',
      icon: GitBranchIcon,
      group: 'Group 1',
      trailingAction: {
        label: 'Trailing Action',
        icon: InfoIcon,
        onClick: () => {
          setSubmenuOpen(prev => !prev)
        },
      },
    },
    {id: 2, text: 'Commit Item 2', icon: GitCommitIcon, group: 'Group 1'},
    {id: 3, text: 'Compare Item 3', icon: GitCompareIcon, group: 'Group 1'},
    {id: 4, text: 'Write Item 4', icon: PencilIcon, group: 'Group 2'},
    {id: 5, text: 'Markdown Item 5', icon: MarkdownIcon, group: 'Group 2'},
    {id: 6, text: 'Heading Item 6', icon: HeadingIcon, group: 'Group 2'},
    {id: 7, text: 'Unordered Item 7', icon: ListUnorderedIcon, group: 'Group 3'},
    {id: 8, text: 'Ordered Item 8', icon: ListOrderedIcon, group: 'Group 3'},
    {id: 9, text: 'Paragraph Item 9', icon: ParagraphIcon, group: 'Group 3'},
  ]

  // Filter items based on input - matches pattern from SelectPanel
  const filteredItems = allItems.filter(item => item.text.toLowerCase().includes(filterValue.toLowerCase()))

  // Group filtered items
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = []
      acc[item.group].push(item)
      return acc
    },
    {} as Record<string, typeof allItems>,
  )

  return (
    <div>
      <Combobox.Root renderAnchor={props => <Button {...props}>Open Combobox</Button>} focusMode="active-descendant">
        <Combobox.Title title="Choose an option" subtitle="Options are filtered as you type" />
        <Combobox.Input
          listboxRef={listboxRef}
          value={filterValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
        />
        <Listbox ref={listboxRef}>
          {Object.entries(groupedItems).map(([groupLabel, items]) => (
            <Listbox.Group key={groupLabel} groupLabel={groupLabel}>
              {items.map(item => (
                <Listbox.Item key={item.id} leadingVisual={item.icon}>
                  {item.text}
                  {item.trailingAction && (
                    <ActionList.TrailingAction
                      label={item.trailingAction.label}
                      icon={item.trailingAction.icon}
                      onClick={item.trailingAction.onClick}
                      ref={item.id === 1 ? trailingRef : undefined}
                    />
                  )}
                </Listbox.Item>
              ))}
            </Listbox.Group>
          ))}
          {filteredItems.length === 0 && (
            <div style={{padding: '16px', textAlign: 'center', color: 'var(--fgColor-muted)'}}>
              No results found for: {filterValue}
            </div>
          )}
        </Listbox>
      </Combobox.Root>

      <AnchoredOverlay
        open={submenuOpen}
        anchorId="testing"
        anchorRef={trailingRef}
        side="outside-right"
        renderAnchor={null}
        width="medium"
        anchorOffset={10}
      >
        <Combobox.Title title="File type / Choose a file type" subtitle="Supported file types" />
        <Listbox>
          <Listbox.Item leadingVisual={FileIcon}>Sub Item 1</Listbox.Item>
          <Listbox.Item leadingVisual={FileZipIcon}>Sub Item 2</Listbox.Item>
          <Listbox.Item leadingVisual={FileCodeIcon}>Sub Item 3</Listbox.Item>
        </Listbox>
      </AnchoredOverlay>
    </div>
  )
}
