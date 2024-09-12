import React, {useState, useRef, useMemo} from 'react'
import type {Meta} from '@storybook/react'
import Box from '../Box'
import {Button} from '../Button'
import type {ItemInput, GroupedListProps} from '../deprecated/ActionList/List'
import {SelectPanel} from './SelectPanel'
import {
  FilterIcon,
  GearIcon,
  NoteIcon,
  ProjectIcon,
  SearchIcon,
  TriangleDownIcon,
  TypographyIcon,
  VersionsIcon,
} from '@primer/octicons-react'

const meta = {
  title: 'Components/SelectPanel/Features',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

function getColorCircle(color: string) {
  return function () {
    return (
      <Box
        bg={color}
        borderColor={color}
        width={14}
        height={14}
        borderRadius={10}
        margin="auto"
        borderWidth="1px"
        borderStyle="solid"
      />
    )
  }
}

const items = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3},
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
]

export const WithItemDividers = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <SelectPanel
      title="Select labels"
      subtitle="Use labels to organize issues and pull requests"
      renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
        <Button
          trailingAction={TriangleDownIcon}
          aria-labelledby={` ${ariaLabelledBy}`}
          {...anchorProps}
          aria-haspopup="dialog"
        >
          {children ?? 'Select Labels'}
        </Button>
      )}
      placeholderText="Filter labels"
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selected}
      onSelectedChange={setSelected}
      onFilterChange={setFilter}
      showItemDividers={true}
    />
  )
}

export const WithPlaceholderForSeachInput = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <SelectPanel
      title="Select labels"
      subtitle="Use labels to organize issues and pull requests"
      renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
        <Button
          trailingAction={TriangleDownIcon}
          aria-labelledby={` ${ariaLabelledBy}`}
          {...anchorProps}
          aria-haspopup="dialog"
        >
          {children ?? 'Select Labels'}
        </Button>
      )}
      placeholderText="Filter labels"
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selected}
      onSelectedChange={setSelected}
      onFilterChange={setFilter}
    />
  )
}

export const WithPlaceholderSelect = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <SelectPanel
      title="Select labels"
      subtitle="Use labels to organize issues and pull requests"
      renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
        <Button
          trailingAction={TriangleDownIcon}
          aria-labelledby={` ${ariaLabelledBy}`}
          {...anchorProps}
          aria-haspopup="dialog"
        >
          {children ?? 'Select Labels'}
        </Button>
      )}
      placeholder="Select issue labels"
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selected}
      onSelectedChange={setSelected}
      onFilterChange={setFilter}
    />
  )
}

export const SingleSelect = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Single Select Panel</h1>
      <div>Please select a label that describe your issue:</div>
      <SelectPanel
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'xsmall'}}
      />
    </>
  )
}

export const MultiSelect = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <h1>Multi Select Panel With Footer</h1>
      <SelectPanel
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        anchorRef={buttonRef}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'medium'}}
      />
    </>
  )
}

export const WithExternalAnchor = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <h1>Select Panel With External Anchor</h1>
      <Button trailingAction={TriangleDownIcon} ref={buttonRef} onClick={() => setOpen(!open)}>
        Custom: {selected?.text || 'Click Me'}
      </Button>
      <SelectPanel
        renderAnchor={null}
        anchorRef={buttonRef}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'xsmall'}}
      />
    </>
  )
}

export const WithFooter = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <h1>Select Panel With Footer</h1>
      <SelectPanel
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        anchorRef={buttonRef}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'medium'}}
        footer={
          <Button size="small" block>
            Edit labels
          </Button>
        }
      />
    </>
  )
}

const listOfItems: Array<ItemInput> = [
  {
    id: '1',
    key: 1,
    leadingVisual: SearchIcon,
    text: 'item 1',
    groupId: '1',
  },
  {
    id: '2',
    key: 2,
    leadingVisual: NoteIcon,
    text: 'Item 2',
    description: 'Some description',
    descriptionVariant: 'block',
    groupId: '1',
  },
  {
    id: '3',
    key: 3,
    leadingVisual: ProjectIcon,
    text: 'Item 3',
    description: 'Some description as well',
    descriptionVariant: 'block',
    groupId: '2',
  },
  {
    id: '4',
    key: 4,
    leadingVisual: FilterIcon,
    text: 'Item 4',
    groupId: '2',
  },
  {id: '5', key: 5, leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '1'},
  {id: '6', key: 6, leadingVisual: GearIcon, text: 'View settings', groupId: '0'},
  {id: '7', key: 7, leadingVisual: TypographyIcon, text: 'Rename', groupId: '0'},
  {id: '8', key: 8, leadingVisual: VersionsIcon, text: 'Duplicate', groupId: '0'},
]

const groupMetadata: GroupedListProps['groupMetadata'] = [
  {groupId: '0', header: {title: 'Repos', variant: 'filled'}},
  {groupId: '1', header: {title: 'Live query', variant: 'filled'}},
  {groupId: '2', header: {title: 'Layout', variant: 'filled'}},
]

export const WithGroups = () => {
  const [selectedIDs, setSelectedIDs] = useState<string[]>([])
  const [filter, setFilter] = React.useState('')
  const filteredItems = listOfItems.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const onSelectedChange = async (selections: ItemInput[]) => {
    const _selectedIDs = selections.flatMap(item => {
      if (item.id === undefined || typeof item.id !== 'string') {
        return []
      }
      return item.id
    })

    setSelectedIDs(_selectedIDs)
  }

  const selectedObjects: ItemInput[] = useMemo(() => {
    const selected: ItemInput[] = []

    for (const selectedID of selectedIDs) {
      const item = listOfItems.find(value => value.id === selectedID)
      if (item) {
        selected.push(item)
      }
    }
    return selected
  }, [selectedIDs])

  return (
    <SelectPanel
      variant="full"
      title="Attach files and symbols"
      subtitle="Choose which files and symbols you want to chat about. Use fewer references for more accurate responses."
      renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
        <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
          {children ?? 'Select Labels'}
        </Button>
      )}
      anchorRef={buttonRef}
      groupMetadata={groupMetadata}
      placeholderText="Filter things"
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selectedObjects}
      onSelectedChange={onSelectedChange}
      onFilterChange={setFilter}
      showItemDividers={true}
      overlayProps={{width: 'large', height: 'xlarge'}}
    />
  )
}
