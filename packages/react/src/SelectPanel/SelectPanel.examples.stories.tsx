import React, {useState} from 'react'
import Box from '../Box'
import type {Meta} from '@storybook/react'
import {Button} from '../Button'
import type {ItemInput} from '../deprecated/ActionList/List'
import {SelectPanel} from './SelectPanel'
import type {OverlayProps} from '../Overlay'
import {TriangleDownIcon} from '@primer/octicons-react'
import {ActionList} from '../deprecated/ActionList'
import {Stack} from '../Stack'
import {Dialog} from '../experimental'

const meta = {
  title: 'Components/SelectPanel/Examples',
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

export const HeightInitialWithOverflowingItemsStory = () => {
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
        overlayProps={{width: 'small', height: 'initial', maxHeight: 'xsmall'}}
      />
    </>
  )
}
HeightInitialWithOverflowingItemsStory.storyName = 'Height: Initial, Overflowing Items'

export const HeightInitialWithUnderflowingItemsStory = () => {
  const underflowingItems = [items[0], items[1]]
  const [selected, setSelected] = React.useState<ItemInput | undefined>(underflowingItems[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = underflowingItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
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
        overlayProps={{width: 'small', height: 'initial', maxHeight: 'xsmall'}}
      />
    </>
  )
}
HeightInitialWithUnderflowingItemsStory.storyName = 'Height: Initial, Underflowing Items'

export const HeightInitialWithUnderflowingItemsAfterFetch = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const [fetchedItems, setFetchedItems] = useState<typeof items>([])
  const filteredItems = React.useMemo(
    () => fetchedItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase())),
    [fetchedItems, filter],
  )
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState<OverlayProps['height']>('auto')

  const onOpenChange = () => {
    setOpen(!open)
    setTimeout(() => {
      setFetchedItems([items[0], items[1]])
      setHeight('initial')
    }, 1500)
  }

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
        onOpenChange={onOpenChange}
        loading={filteredItems.length === 0}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height, maxHeight: 'xsmall'}}
      />
    </>
  )
}
HeightInitialWithUnderflowingItemsAfterFetch.storyName = 'Height: Initial, Underflowing Items (After Fetch)'

export const AboveTallBody = () => {
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
      <div
        style={{
          backgroundColor: '#9c27b0',
          height: '100vh',
          padding: '20px',
          margin: '20px',
          color: 'white',
        }}
      >
        This element makes the body really tall. This is to test that we do not have layout/focus issues if the Portal
        is far down the page
      </div>
    </>
  )
}

export const HeightVariantionsAndScroll = () => {
  const longItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items]
  const [selectedA, setSelectedA] = React.useState<ItemInput | undefined>(longItems[0])
  const [selectedB, setSelectedB] = React.useState<ItemInput | undefined>(longItems[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = longItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [openA, setOpenA] = useState(false)
  const [openB, setOpenB] = useState(false)

  return (
    <>
      <h2>With height:medium</h2>
      <SelectPanel
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={openA}
        onOpenChange={setOpenA}
        items={filteredItems}
        selected={selectedA}
        onSelectedChange={setSelectedA}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{height: 'medium'}}
      />
      <h2>With height:auto, maxheight:medium</h2>
      <SelectPanel
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={openB}
        onOpenChange={setOpenB}
        items={filteredItems}
        selected={selectedB}
        onSelectedChange={setSelectedB}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{
          height: 'auto',
          maxHeight: 'medium',
        }}
      />
    </>
  )
}

const longItems = [
  {text: 'src/SelectPanel/SelectPanel.tsx', id: 3},
  {text: 'src/SelectPanel/SelectPanel.stories.tsx', id: 4},
  {text: 'src/SelectPanel/SelectPanel.features.stories.tsx', id: 5},
  {text: 'src/SelectPanel/SelectPanel.examples.stories.tsx', id: 6},
]

export const CustomItemRenderer = () => {
  const items = longItems
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Long string with truncation (not reviewed for accessibility)</h1>
      <SelectPanel
        title="Select files"
        renderAnchor={({'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button
            trailingAction={TriangleDownIcon}
            aria-labelledby={` ${ariaLabelledBy}`}
            {...anchorProps}
            aria-haspopup="dialog"
          >
            Select files
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        overlayProps={{width: 'medium'}}
        renderItem={item => (
          <ActionList.Item
            {...item}
            text={undefined}
            sx={{
              mx: 2,
              '&[data-is-active-descendant="activated-directly"]': {
                backgroundColor: 'transparent',
                outline: '2px solid var(--focus-outlineColor, var(--color-accent-emphasis))',
                outlineOffset: '-2px',
              },
            }}
          >
            {' '}
            <Box
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {item.text}
            </Box>
          </ActionList.Item>
        )}
      />
    </>
  )
}

export const ItemsInScope = () => {
  // items are defined in the same scope as selection, so they could rerender and create new object references
  // We use item.id to track selection
  // Reported in: https://github.com/primer/react/issues/4315
  const items = [
    {text: 'enhancement', id: 1},
    {text: 'bug', id: 2},
    {text: 'good first issue', id: 3},
    {text: 'design', id: 4},
    {text: 'blocker', id: 5},
    {text: 'backend', id: 6},
    {text: 'frontend', id: 7},
  ]

  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))

  return (
    <>
      <h1>Items in component scope</h1>
      <SelectPanel
        title="Select labels"
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
      />
    </>
  )
}

export const RepositionAfterLoading = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    if (!open) setLoading(true)
    window.setTimeout(() => {
      if (open) setLoading(false)
    }, 2000)
  }, [open])

  return (
    <>
      <Stack direction="vertical" justify="space-between" style={{height: 'calc(100vh - 300px)', width: 'fit-content'}}>
        <h1>Reposition panel after loading</h1>
        <SelectPanel
          loading={loading}
          title="Select labels"
          placeholderText="Filter Labels"
          open={open}
          onOpenChange={setOpen}
          items={filteredItems}
          selected={selected}
          onSelectedChange={setSelected}
          onFilterChange={setFilter}
        />
      </Stack>
    </>
  )
}

export const SelectPanelInsideDialog = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    if (!open) setLoading(true)
    window.setTimeout(() => {
      if (open) setLoading(false)
    }, 2000)
  }, [open])

  return (
    <Dialog title="SelectPanel inside Dialog" onClose={() => {}}>
      <Stack direction="vertical" justify="space-between" style={{height: 'calc(100vh - 500px)', width: 'fit-content'}}>
        <p>other content</p>
        <SelectPanel
          loading={loading}
          title="Select labels"
          placeholderText="Filter Labels"
          open={open}
          onOpenChange={setOpen}
          items={filteredItems}
          selected={selected}
          onSelectedChange={setSelected}
          onFilterChange={setFilter}
        />
      </Stack>
    </Dialog>
  )
}
