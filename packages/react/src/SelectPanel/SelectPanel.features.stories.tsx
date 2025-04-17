import React, {useState, useRef} from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import Box from '../Box'
import {Button} from '../Button'
import type {ItemInput, GroupedListProps} from '../deprecated/ActionList/List'
import Link from '../Link'
import {SelectPanel, type SelectPanelProps} from './SelectPanel'
import {
  AlertIcon,
  FilterIcon,
  GearIcon,
  InfoIcon,
  NoteIcon,
  ProjectIcon,
  SearchIcon,
  StopIcon,
  TriangleDownIcon,
  TypographyIcon,
  VersionsIcon,
} from '@primer/octicons-react'
import useSafeTimeout from '../hooks/useSafeTimeout'
import ToggleSwitch from '../ToggleSwitch'
import Text from '../Text'
import FormControl from '../FormControl'
import {SegmentedControl} from '../SegmentedControl'
import {Stack} from '../Stack'

const meta: Meta<typeof SelectPanel> = {
  title: 'Components/SelectPanel/Features',
  component: SelectPanel,
} satisfies Meta<SelectPanelProps>

export default meta

const NoResultsMessage = (filter: string): {variant: 'empty'; title: string; body: string} => {
  return {
    variant: 'empty',
    title: `No language found for \`${filter}\``,
    body: 'Adjust your search term to find other languages',
  }
}

const EmptyMessage: {variant: 'empty'; title: string; body: React.ReactElement} = {
  variant: 'empty',
  title: `You haven't created any projects yet`,
  body: (
    <>
      <Link href="https://github.com/projects">Start your first project</Link> to organise your issues.
    </>
  ),
}

const ErrorMessage: {variant: 'error'; title: string; body: string} = {
  variant: 'error',
  title: 'Oops',
  body: 'Something went wrong.',
}

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
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels" // button text when no items are selected
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
            {children}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={selectedItemsSortedFirst}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        width="medium"
        message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

export const WithPlaceholderForSearchInput = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels" // button text when no items are selected
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
            {children}
          </Button>
        )}
        placeholderText="Filter labels"
        open={open}
        onOpenChange={setOpen}
        items={selectedItemsSortedFirst}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        width="medium"
        message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

export const SingleSelect = () => {
  const [selected, setSelected] = useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Label</FormControl.Label>
      <SelectPanel
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholder="Select labels" // button text when no items are selected
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        width="medium"
        message={filteredItems.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

export const MultiSelect = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels"
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
            {children}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        width="medium"
        message={filteredItems.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

export const WithExternalAnchor = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <Button trailingAction={TriangleDownIcon} ref={buttonRef} onClick={() => setOpen(!open)}>
        {selected.map(selectedItem => selectedItem.text).join(', ') || 'Select labels'}
      </Button>
      <SelectPanel
        renderAnchor={null}
        anchorRef={buttonRef}
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selectedItemsSortedFirst}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        width="medium"
        message={filteredItems.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

export const WithFooter = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <SelectPanel
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps}>
            {children}
          </Button>
        )}
        placeholder="Select labels" // button text when no items are selected
        open={open}
        onOpenChange={setOpen}
        items={selectedItemsSortedFirst}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        overlayProps={{width: 'small', height: 'medium'}}
        footer={
          <Button size="small" block>
            Edit labels
          </Button>
        }
        width="medium"
        message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

export const WithNotice = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)
  const [noticeVariant, setNoticeVariant] = useState(0)

  const noticeVariants: Array<{text: string | React.ReactElement; variant: 'info' | 'warning' | 'error'}> = [
    {
      variant: 'info',
      text: 'Try a different search term.',
    },
    {
      variant: 'warning',
      text: (
        <>
          You have reached the limit of assignees on your free account.{' '}
          <Link href="/upgrade">Upgrade your account.</Link>
        </>
      ),
    },
    {
      variant: 'error',
      text: (
        <>
          We couldn&apos;t load all collaborators. Try again or if the problem persists,{' '}
          <Link href="/support">contact support</Link>
        </>
      ),
    },
  ]

  return (
    <Stack align="start">
      <FormControl>
        <FormControl.Label>Notice variant</FormControl.Label>
        <SegmentedControl aria-label="Notice variant" onChange={setNoticeVariant}>
          <SegmentedControl.Button defaultSelected aria-label={'Info'} leadingIcon={InfoIcon}>
            Info notice
          </SegmentedControl.Button>
          <SegmentedControl.Button aria-label={'Warning'} leadingIcon={AlertIcon}>
            Warning notice
          </SegmentedControl.Button>
          <SegmentedControl.Button aria-label={'Error'} leadingIcon={StopIcon}>
            Error notice
          </SegmentedControl.Button>
        </SegmentedControl>
      </FormControl>
      <FormControl>
        <FormControl.Label>SelectPanel with notice</FormControl.Label>
        <SelectPanel
          renderAnchor={({children, ...anchorProps}) => (
            <Button trailingAction={TriangleDownIcon} {...anchorProps}>
              {children}
            </Button>
          )}
          placeholder="Select labels" // button text when no items are selected
          open={open}
          onOpenChange={setOpen}
          items={selectedItemsSortedFirst}
          selected={selected}
          onSelectedChange={setSelected}
          onFilterChange={setFilter}
          overlayProps={{width: 'small', height: 'medium'}}
          width="medium"
          notice={noticeVariants[noticeVariant]}
        />
      </FormControl>
    </Stack>
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
  const [selected, setSelected] = useState<ItemInput[]>([])
  const [filter, setFilter] = useState('')
  const filteredItems = listOfItems.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    if (a.groupId === b.groupId) {
      const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
      const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
      if (aIsSelected && !bIsSelected) return -1
      if (!aIsSelected && bIsSelected) return 1
    }
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Options</FormControl.Label>
      <SelectPanel
        title="Attach files and symbols"
        subtitle="Choose which files and symbols you want to chat about. Use fewer references for more accurate responses."
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps}>
            {children}
          </Button>
        )}
        placeholder="Select options" // button text when no items are selected
        groupMetadata={groupMetadata}
        open={open}
        onOpenChange={setOpen}
        items={selectedItemsSortedFirst}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        overlayProps={{width: 'large', height: 'xlarge'}}
        width="medium"
        message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

export const WithLabelVisuallyHidden = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label visuallyHidden>Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels" // button text when no items are selected
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
            {children}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={selectedItemsSortedFirst}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        width="medium"
        message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

export const WithLabelInternally = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <SelectPanel
      renderAnchor={({children, ...anchorProps}) => (
        <Button {...anchorProps} trailingAction={TriangleDownIcon} aria-haspopup="dialog">
          <Box
            sx={{
              color: 'var(--fgColor-muted)',
              display: 'inline-block',
            }}
          >
            Choices:
          </Box>{' '}
          {children || 'None selected'}
        </Button>
      )}
      open={open}
      onOpenChange={setOpen}
      items={selectedItemsSortedFirst}
      selected={selected}
      onSelectedChange={setSelected}
      onFilterChange={setFilter}
      width="medium"
      message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
    />
  )
}

export const AsyncFetch: StoryObj<SelectPanelProps> = {
  render: ({initialLoadingType, height}: SelectPanelProps) => {
    const [selected, setSelected] = React.useState<ItemInput[]>([])
    const [filteredItems, setFilteredItems] = React.useState<ItemInput[]>([])
    const [open, setOpen] = useState(false)
    const filterTimerId = useRef<number | null>(null)
    const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
    const [query, setQuery] = useState('')

    const fetchItems = (query: string) => {
      if (filterTimerId.current) {
        safeClearTimeout(filterTimerId.current)
        setQuery(query)
      }

      filterTimerId.current = safeSetTimeout(() => {
        setFilteredItems(items.filter(item => item.text.toLowerCase().startsWith(query.toLowerCase())))
      }, 2000) as unknown as number
    }

    const onOpenChange = (value: boolean) => {
      setOpen(value)
      fetchItems('')
    }

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
        onOpenChange={onOpenChange}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={fetchItems}
        showItemDividers={true}
        height={height}
        initialLoadingType={initialLoadingType}
        width="medium"
        message={filteredItems.length === 0 ? NoResultsMessage(query) : undefined}
      />
    )
  },
  args: {
    initialLoadingType: 'spinner',
    height: 'medium',
  },
  argTypes: {
    initialLoadingType: {
      control: 'select',
      options: ['spinner', 'skeleton'],
    },
    height: {
      control: 'select',
      options: ['auto', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
}

export const CustomisedNoInitialItems = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([])
  const [filteredItems, setFilteredItems] = React.useState<ItemInput[]>([])
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<string>('')
  const onFilterChange = (value: string = '') => {
    setFilter(value)
    setTimeout(() => {
      // fetch the items
      setFilteredItems([])
    }, 0)
  }
  const [isError, setIsError] = React.useState(false)

  const onClick = React.useCallback(() => {
    setIsError(!isError)
  }, [setIsError, isError])

  function getMessage(): {variant: 'empty' | 'error'; title: string; body: string | React.ReactElement} {
    if (isError) return ErrorMessage
    else if (filter) return NoResultsMessage(filter)
    else return EmptyMessage
  }

  return (
    <>
      <Text id="toggle" fontWeight={'bold'} fontSize={2}>
        Enable Error State :{isError ? 'On' : 'Off'}
      </Text>
      <ToggleSwitch onClick={onClick} checked={isError} aria-labelledby="toggle" />
      <SelectPanel
        title="Set projects"
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={onFilterChange}
        width="medium"
        height="large"
        message={getMessage()}
      />
    </>
  )
}

export const CustomisedNoResults: StoryObj<typeof SelectPanel> = {
  render: ({initialLoadingType, height}) => {
    const [selected, setSelected] = React.useState<ItemInput[]>([])
    const [filteredItems, setFilteredItems] = React.useState<ItemInput[]>([])
    const [filterValue, setFilterValue] = React.useState<string>('')
    const [open, setOpen] = useState(false)
    const filterTimerId = useRef<number | null>(null)
    const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
    const onFilterChange = (value: string) => {
      setFilterValue(value)
      if (filterTimerId.current) {
        safeClearTimeout(filterTimerId.current)
      }

      filterTimerId.current = safeSetTimeout(() => {
        setFilteredItems(items.filter(item => item.text.toLowerCase().startsWith(value.toLowerCase())))
      }, 2000) as unknown as number
    }

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
        onFilterChange={onFilterChange}
        showItemDividers={true}
        initialLoadingType={initialLoadingType}
        height={height}
        overlayProps={{maxHeight: height === 'auto' || height === 'initial' ? 'xlarge' : height}}
        message={filteredItems.length === 0 ? NoResultsMessage(filterValue) : undefined}
      />
    )
  },
  args: {
    initialLoadingType: 'spinner',
    height: 'medium',
  },
  argTypes: {
    initialLoadingType: {
      control: 'select',
      options: ['spinner', 'skeleton'],
    },
    height: {
      control: 'select',
      options: ['auto', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
}

export const WithOnCancel = () => {
  const [intialSelection, setInitialSelection] = React.useState<ItemInput[]>(items.slice(1, 3))

  const [selected, setSelected] = React.useState<ItemInput[]>(intialSelection)
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))

  const [open, setOpen] = useState(false)
  React.useEffect(() => {
    if (!open) setInitialSelection(selected) // set initialSelection for next time
  }, [open, selected])

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels"
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
            {children}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onCancel={() => setSelected(intialSelection)}
        onFilterChange={setFilter}
        width="medium"
      />
    </FormControl>
  )
}

export const MultiSelectModal = () => {
  const [intialSelection, setInitialSelection] = React.useState<ItemInput[]>(items.slice(1, 3))

  const [selected, setSelected] = React.useState<ItemInput[]>(intialSelection)
  const [filter, setFilter] = React.useState('')
  const [open, setOpen] = useState(false)

  React.useEffect(() => {
    if (!open) setInitialSelection(selected) // Save selection as initialSelection for next time
  }, [open, selected])

  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))

  return (
    <SelectPanel
      variant="modal"
      title="Select labels"
      placeholder="Select labels"
      subtitle="Use labels to organize issues and pull requests"
      renderAnchor={({children, ...anchorProps}) => (
        <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
          {children}
        </Button>
      )}
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selected}
      onSelectedChange={setSelected}
      onCancel={() => setSelected(intialSelection)}
      onFilterChange={setFilter}
      width="medium"
    />
  )
}

export const SingleSelectModal = () => {
  const [selected, setSelected] = useState<ItemInput | undefined>(undefined)
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))

  return (
    <SelectPanel
      variant="modal"
      title="Select labels"
      placeholder="Select labels"
      subtitle="Use labels to organize issues and pull requests"
      renderAnchor={({children, ...anchorProps}) => (
        <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
          {children}
        </Button>
      )}
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selected}
      onSelectedChange={setSelected}
      onCancel={() => {}}
      onFilterChange={setFilter}
      width="medium"
    />
  )
}
