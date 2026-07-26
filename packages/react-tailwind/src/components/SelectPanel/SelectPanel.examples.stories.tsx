import type {Meta, StoryObj} from '@storybook/react-vite'
import {TriangleDownIcon} from '@primer/octicons-react'
import React from 'react'
import {Button} from '../Button'
import {Checkbox} from '../Checkbox'
import {Dialog} from '../Dialog'
import {FormControl} from '../FormControl'
import {SelectPanel, type SelectPanelItem, type SelectPanelProps} from './SelectPanel'

const meta = {
  title: 'React Tailwind/Components/SelectPanel/Examples',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta
type Story = StoryObj

type StorySelectPanelProps = Partial<Omit<SelectPanelProps, 'anchorRef' | 'onCancel' | 'renderAnchor' | 'variant'>> & {
  onCancel?: () => void
  renderAnchor?: Exclude<SelectPanelProps['renderAnchor'], null>
  variant?: 'anchored' | 'modal'
}

function ColorCircle({color}: {color: string}) {
  return (
    <span
      aria-hidden="true"
      className="size-3 rounded-full border"
      style={{backgroundColor: color, borderColor: color}}
    />
  )
}

const labels: SelectPanelItem[] = [
  {id: 1, leadingVisual: <ColorCircle color="#a2eeef" />, text: 'enhancement'},
  {id: 2, leadingVisual: <ColorCircle color="#d73a4a" />, text: 'bug'},
  {id: 3, leadingVisual: <ColorCircle color="#0cf478" />, text: 'good first issue'},
  {id: 4, leadingVisual: <ColorCircle color="#ffd78e" />, text: 'design'},
  {id: 5, leadingVisual: <ColorCircle color="#ff0000" />, text: 'blocker'},
  {id: 6, leadingVisual: <ColorCircle color="#a4f287" />, text: 'backend'},
  {id: 7, leadingVisual: <ColorCircle color="#8dc6fc" />, text: 'frontend'},
]

function textOf(item: SelectPanelItem) {
  return typeof item.text === 'string' ? item.text : ''
}

function asItems(selection: SelectPanelItem | SelectPanelItem[] | undefined) {
  return Array.isArray(selection) ? selection : selection ? [selection] : []
}

interface ExamplePanelProps {
  initialSelected?: SelectPanelItem | SelectPanelItem[] | undefined
  items?: readonly SelectPanelItem[]
  label?: React.ReactNode | null
  multiple?: boolean
  selectPanelProps?: StorySelectPanelProps
  title?: string
}

function ExamplePanel({
  initialSelected,
  items = labels,
  label = 'Labels',
  multiple = true,
  selectPanelProps,
  title = 'Select labels',
}: ExamplePanelProps) {
  const [filterValue, setFilterValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SelectPanelItem | SelectPanelItem[] | undefined>(
    initialSelected ?? (multiple ? items.slice(1, 3) : items[0]),
  )
  const props = selectPanelProps ?? {}
  const {onCancel, variant = 'anchored', ...restProps} = props
  const currentFilterValue = props.filterValue ?? filterValue
  const filteredItems = items.filter(item => textOf(item).toLowerCase().startsWith(currentFilterValue.toLowerCase()))

  const panel =
    variant === 'modal' ? (
      <SelectPanel
        {...restProps}
        filterValue={currentFilterValue}
        items={restProps.items ?? filteredItems}
        onCancel={onCancel ?? (() => {})}
        onFilterChange={restProps.onFilterChange ?? setFilterValue}
        onOpenChange={restProps.onOpenChange ?? setOpen}
        onSelectedChange={restProps.onSelectedChange ?? setSelected}
        open={restProps.open ?? open}
        placeholder="Select labels"
        selected={restProps.selected ?? selected}
        selectionVariant={multiple ? 'multiple' : 'single'}
        subtitle="Use labels to organize issues and pull requests"
        title={title}
        variant="modal"
      />
    ) : (
      <SelectPanel
        {...restProps}
        filterValue={currentFilterValue}
        items={restProps.items ?? filteredItems}
        onCancel={onCancel}
        onFilterChange={restProps.onFilterChange ?? setFilterValue}
        onOpenChange={restProps.onOpenChange ?? setOpen}
        onSelectedChange={restProps.onSelectedChange ?? setSelected}
        open={restProps.open ?? open}
        placeholder="Select labels"
        selected={restProps.selected ?? selected}
        selectionVariant={multiple ? 'multiple' : 'single'}
        subtitle="Use labels to organize issues and pull requests"
        title={title}
        variant="anchored"
      />
    )

  return label === null ? (
    panel
  ) : (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      {panel}
    </FormControl>
  )
}

const overflowingItems = Array.from({length: 40}, (_, index) => ({id: index, text: `Label ${index + 1}`}))

export const HeightInitialWithOverflowingItemsStory: Story = {
  render: () => (
    <ExamplePanel
      items={overflowingItems}
      selectPanelProps={{height: 'initial', overlayProps: {maxHeight: 'xsmall'}}}
    />
  ),
}
HeightInitialWithOverflowingItemsStory.storyName = 'Height: Initial, Overflowing Items'

export const HeightInitialWithUnderflowingItemsStory: Story = {
  render: () => (
    <ExamplePanel
      initialSelected={labels[0]}
      items={labels.slice(0, 2)}
      selectPanelProps={{height: 'initial', overlayProps: {maxHeight: 'xsmall'}, showItemDividers: true}}
    />
  ),
}
HeightInitialWithUnderflowingItemsStory.storyName = 'Height: Initial, Underflowing Items'

export const HeightInitialWithUnderflowingItemsAfterFetch: Story = {
  render: () => {
    const [itemsToShow, setItemsToShow] = React.useState<SelectPanelItem[]>([])
    const [hasFetched, setHasFetched] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    React.useEffect(() => {
      if (!open) return
      const timeout = window.setTimeout(() => {
        setItemsToShow(labels.slice(0, 2))
        setHasFetched(true)
      }, 800)
      return () => window.clearTimeout(timeout)
    }, [open])
    return (
      <ExamplePanel
        initialSelected={labels[0]}
        items={itemsToShow}
        selectPanelProps={{
          height: 'initial',
          loading: open && !hasFetched,
          onOpenChange: nextOpen => {
            setOpen(nextOpen)
            if (nextOpen) {
              setHasFetched(false)
              setItemsToShow([])
            }
          },
          open,
          overlayProps: {maxHeight: 'xsmall'},
          showItemDividers: true,
        }}
      />
    )
  },
}
HeightInitialWithUnderflowingItemsAfterFetch.storyName = 'Height: Initial, Underflowing Items (After Fetch)'

export const AboveTallBody: Story = {
  render: () => (
    <>
      <ExamplePanel selectPanelProps={{showItemDividers: true}} />
      <div className="m-5 h-screen bg-[rgb(156,39,176)] p-5 text-white">
        This element makes the body really tall. It verifies that portal positioning remains stable far down the page.
      </div>
    </>
  ),
}

export const HeightVariationsAndScroll: Story = {
  render: () => (
    <>
      <ExamplePanel
        items={overflowingItems}
        multiple={false}
        selectPanelProps={{height: 'medium', showItemDividers: true}}
        title="With height: medium"
      />
      <br />
      <ExamplePanel
        items={labels.slice(0, 2)}
        multiple={false}
        selectPanelProps={{overlayProps: {maxHeight: 'medium'}, showItemDividers: true}}
        title="With height: auto, max height: medium"
      />
    </>
  ),
}

export const CustomItemRenderer: Story = {
  render: () => {
    const fileItems = [
      {id: 3, text: 'src/SelectPanel/SelectPanel.tsx'},
      {id: 4, text: 'src/SelectPanel/SelectPanel.stories.tsx'},
      {id: 5, text: 'src/SelectPanel/SelectPanel.features.stories.tsx'},
      {id: 6, text: 'src/SelectPanel/SelectPanel.examples.stories.tsx'},
    ]
    return (
      <ExamplePanel
        items={fileItems}
        label="Long string with truncation (not reviewed for accessibility)"
        selectPanelProps={{
          overlayProps: {width: 'medium'},
          renderAnchor: () => <Button trailingVisual={<TriangleDownIcon aria-hidden="true" />}>Select files</Button>,
          renderItem: item => (
            <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm text-default">
              {item.text}
            </span>
          ),
        }}
        title="Select files"
      />
    )
  },
}

export const ItemsInScope: Story = {
  render: () => {
    const inScopeItems = labels.map(item => ({...item}))
    return (
      <ExamplePanel
        initialSelected={inScopeItems.slice(1, 3)}
        items={inScopeItems}
        label="Items in component scope"
        title="Select labels"
      />
    )
  },
}

function RepositionAfterLoadingFixture({insideDialog = false}: {insideDialog?: boolean}) {
  const [filterValue, setFilterValue] = React.useState('')
  const [itemsToShow, setItemsToShow] = React.useState<SelectPanelItem[]>([])
  const [loadedFilterValue, setLoadedFilterValue] = React.useState<string | undefined>()
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SelectPanelItem[]>([labels[0], labels[1]])

  React.useEffect(() => {
    if (!open) return
    const timeout = window.setTimeout(() => {
      setItemsToShow(labels.filter(item => textOf(item).toLowerCase().startsWith(filterValue.toLowerCase())))
      setLoadedFilterValue(filterValue)
    }, 800)
    return () => window.clearTimeout(timeout)
  }, [filterValue, open])

  const panel = (
    <ExamplePanel
      initialSelected={selected}
      items={itemsToShow}
      selectPanelProps={{
        filterValue,
        loading: open && loadedFilterValue !== filterValue,
        onFilterChange: setFilterValue,
        onOpenChange: setOpen,
        onSelectedChange: next => setSelected(asItems(next)),
        open,
      }}
    />
  )

  if (!insideDialog) {
    return (
      <div className="flex h-[calc(100vh-300px)] w-fit flex-col justify-between">
        <h1>Reposition panel after loading</h1>
        {panel}
      </div>
    )
  }

  return (
    <Dialog open onOpenChange={() => {}}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>SelectPanel reposition after loading inside Dialog</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex h-[calc(100vh-500px)] w-fit flex-col justify-between">
            <p>other content</p>
            {panel}
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  )
}

export const RepositionAfterLoading: Story = {
  render: () => <RepositionAfterLoadingFixture />,
}

export const SelectPanelRepositionInsideDialog: Story = {
  render: () => <RepositionAfterLoadingFixture insideDialog />,
}

export const WithDefaultMessage: Story = {
  render: () => <ExamplePanel initialSelected={labels.slice(1, 3)} items={labels} />,
}

const renderMoreItems = Array.from({length: 180}, (_, index) => ({
  description: index === 5 ? 'This row demonstrates wrapped supporting text.' : undefined,
  descriptionVariant: 'block' as const,
  id: index,
  text: `Item ${index + 1}`,
}))

function RenderSubsetControl({
  caption,
  checked,
  onCheckedChange,
}: {
  caption: React.ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-x-2">
      <Checkbox checked={checked} className="mt-0.5" onCheckedChange={onCheckedChange} />
      <div>
        <div className="text-sm font-medium text-default">Render subset of items on initial open</div>
        <div className="text-xs leading-[18px] text-muted">{caption}</div>
      </div>
    </div>
  )
}

export const RenderMoreOnScroll: Story = {
  render: () => {
    const [count, setCount] = React.useState(50)
    const [renderSubset, setRenderSubset] = React.useState(true)
    return (
      <form>
        <RenderSubsetControl
          caption={renderSubset ? 'Loads more items on scroll' : `Loads all ${renderMoreItems.length} items at once`}
          checked={renderSubset}
          onCheckedChange={nextValue => {
            setRenderSubset(nextValue)
            setCount(50)
          }}
        />
        <p>
          Time taken (ms) to render initial {renderSubset ? 50 : renderMoreItems.length} items: (click &quot;Select
          labels&quot; to open)
        </p>
        <p>Known bug: Scroll resets to top when the items change.</p>
        <ExamplePanel
          initialSelected={[]}
          items={renderMoreItems.slice(0, renderSubset ? count : renderMoreItems.length)}
          selectPanelProps={{
            height: 'large',
            onScrollEnd: () => setCount(previous => Math.min(previous + 50, renderMoreItems.length)),
          }}
        />
      </form>
    )
  },
}

export const VirtualizedConsumerSide: Story = {
  render: () => {
    const [count, setCount] = React.useState(50)
    return (
      <form>
        <RenderSubsetControl
          caption="Uses virtualization to render visible items efficiently"
          checked
          onCheckedChange={() => setCount(50)}
        />
        <p>Time taken (ms) to render initial {count} items: (click &quot;Select labels&quot; to open)</p>
        <ExamplePanel
          initialSelected={[]}
          items={renderMoreItems.slice(0, count)}
          selectPanelProps={{
            actionListProps: {style: {minHeight: 0}},
            height: 'large',
            onScrollEnd: () => setCount(previous => Math.min(previous + 50, renderMoreItems.length)),
          }}
        />
      </form>
    )
  },
}

export const VirtualizedBuiltIn: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <form>
        <h3>Without virtualization</h3>
        <p>Time to open (ms): (click to open)</p>
        <ExamplePanel
          initialSelected={[]}
          items={renderMoreItems}
          label={`Labels (${renderMoreItems.length} items)`}
          selectPanelProps={{height: 'large'}}
          title="Select labels"
        />
      </form>
      <form>
        <h3>With virtualization</h3>
        <p>Time to open (ms): (click to open)</p>
        <ExamplePanel
          initialSelected={[]}
          items={renderMoreItems}
          label={`Labels (${renderMoreItems.length} items, virtualized)`}
          selectPanelProps={{height: 'large', virtualized: true}}
          title="Select labels"
        />
      </form>
    </div>
  ),
}
