import type {Meta, StoryObj} from '@storybook/react-vite'
import {SmileyIcon, TriangleDownIcon} from '@primer/octicons-react'
import React from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {ActionMenu} from '../ActionMenu'
import {Button} from '../Button'
import {Checkbox} from '../Checkbox'
import {Dialog} from '../Dialog'
import {FormControl} from '../FormControl'
import {Stack} from '../Stack'
import {SelectPanel, type SelectPanelItem, type SelectPanelProps} from './SelectPanel'

const meta = {
  title: 'React Tailwind/Components/SelectPanel/Examples',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta
type Story = StoryObj

type StorySelectPanelProps = Partial<
  Omit<
    SelectPanelProps,
    'anchorRef' | 'onCancel' | 'onSelectedChange' | 'renderAnchor' | 'selected' | 'selectionVariant' | 'variant'
  >
> & {
  onSelectedChange?: (selected: SelectPanelItem[]) => void
  onCancel?: () => void
  renderAnchor?: Exclude<SelectPanelProps['renderAnchor'], null>
  variant?: 'anchored' | 'modal'
}

function ColorCircle({color}: {color: string}) {
  return (
    <span
      aria-hidden="true"
      className="size-3 rounded-full border-thin"
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
  children?: React.ReactNode
  initialSelected?: SelectPanelItem | SelectPanelItem[] | undefined
  items?: readonly SelectPanelItem[]
  label?: React.ReactNode | null
  multiple?: boolean
  selectPanelProps?: StorySelectPanelProps
  title?: string
}

function ExamplePanel({
  children,
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
  const {onCancel, onSelectedChange, variant = 'anchored', ...restProps} = props
  const selectionProps = multiple
    ? ({
        selectionVariant: 'multiple',
        selected: asItems(selected),
        onSelectedChange: (next: SelectPanelItem[]) => {
          setSelected(next)
          onSelectedChange?.(next)
        },
      } as const)
    : ({
        selectionVariant: 'single',
        selected: Array.isArray(selected) ? selected[0] : selected,
        onSelectedChange: (next: SelectPanelItem | undefined) => {
          setSelected(next)
          onSelectedChange?.(asItems(next))
        },
      } as const)
  const currentFilterValue = props.filterValue ?? filterValue
  const filteredItems = items.filter(item => textOf(item).toLowerCase().startsWith(currentFilterValue.toLowerCase()))

  const panel =
    variant === 'modal' ? (
      <SelectPanel
        {...restProps}
        {...selectionProps}
        filterValue={currentFilterValue}
        items={restProps.items ?? filteredItems}
        onCancel={onCancel ?? (() => {})}
        onFilterChange={restProps.onFilterChange ?? setFilterValue}
        onOpenChange={restProps.onOpenChange ?? setOpen}
        open={restProps.open ?? open}
        placeholder="Select labels"
        subtitle="Use labels to organize issues and pull requests"
        title={title}
        variant="modal"
      />
    ) : (
      <SelectPanel
        {...restProps}
        {...selectionProps}
        filterValue={currentFilterValue}
        items={restProps.items ?? filteredItems}
        onCancel={onCancel}
        onFilterChange={restProps.onFilterChange ?? setFilterValue}
        onOpenChange={restProps.onOpenChange ?? setOpen}
        open={restProps.open ?? open}
        placeholder="Select labels"
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
      {children}
    </FormControl>
  )
}

export const HeightInitialWithOverflowingItemsStory: Story = {
  render: () => (
    <ExamplePanel selectPanelProps={{height: 'initial', overlayProps: {width: 'small', maxHeight: 'xsmall'}}} />
  ),
}
HeightInitialWithOverflowingItemsStory.storyName = 'Height: Initial, Overflowing Items'

export const HeightInitialWithUnderflowingItemsStory: Story = {
  render: () => (
    <ExamplePanel
      initialSelected={labels[0]}
      items={labels.slice(0, 2)}
      selectPanelProps={{
        height: 'initial',
        overlayProps: {width: 'small', maxHeight: 'xsmall'},
        showItemDividers: true,
      }}
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
          overlayProps: {width: 'small', maxHeight: 'xsmall'},
          showItemDividers: true,
        }}
      />
    )
  },
}
HeightInitialWithUnderflowingItemsAfterFetch.storyName = 'Height: Initial, Underflowing Items (After Fetch)'

export const AboveTallBody: Story = {
  render: () => (
    <ExamplePanel selectPanelProps={{showItemDividers: true}}>
      {/* lint-tailwind-disable-next-line -- matches the upstream fixture's purple tall-body block */}
      <div className="h-screen bg-[rgb(156,39,176)] p-5 text-white" style={{margin: '20px'}}>
        This element makes the body really tall. This is to test that we do not have layout/focus issues if the Portal
        is far down the page
      </div>
    </ExamplePanel>
  ),
}

const longLabels = Array.from({length: 8}, (_, copy) =>
  labels.map(item => ({...item, id: `${item.id}-${copy}`})),
).flat()

export const HeightVariationsAndScroll: Story = {
  render: () => (
    <>
      <ExamplePanel
        items={longLabels}
        label="With height:medium"
        multiple={false}
        selectPanelProps={{overlayProps: {height: 'medium'}, showItemDividers: true}}
      />
      <br />
      <ExamplePanel
        items={longLabels}
        label="With height:auto, maxheight:medium"
        multiple={false}
        selectPanelProps={{overlayProps: {height: 'auto', maxHeight: 'medium'}, showItemDividers: true}}
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
      label={null}
      selectPanelProps={{
        filterValue,
        loading: open && loadedFilterValue !== filterValue,
        onFilterChange: setFilterValue,
        onOpenChange: setOpen,
        onSelectedChange: setSelected,
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

function ProjectPickerPortalExample({modal = false, namedPortal = true}: {modal?: boolean; namedPortal?: boolean}) {
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null)
  const [selected, setSelected] = React.useState<SelectPanelItem | undefined>()
  const variantProps = modal ? ({variant: 'modal', onCancel: () => {}} as const) : ({variant: 'anchored'} as const)
  const projects = [
    {id: 'roadmap', text: 'Roadmap'},
    {id: 'planning', text: 'Planning'},
  ]

  return (
    <Dialog>
      <Dialog.Trigger render={<Button>Open project settings</Button>} />
      <Dialog.Content width="xlarge">
        <Dialog.Header>
          <Dialog.Title>Project settings</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>Choose the project associated with this item.</Dialog.Description>
          <div data-testid="project-picker-portal" ref={setPortalContainer} />
          <div
            className="h-52 w-48 overflow-auto rounded-md border-thin border-default"
            data-testid="project-picker-scroll"
          >
            <div aria-hidden="true" className="h-80" />
            <SelectPanel
              {...variantProps}
              items={projects}
              onSelectedChange={setSelected}
              overlayProps={namedPortal ? {container: portalContainer} : undefined}
              selected={selected}
              title="Projects"
            />
            <div aria-hidden="true" className="h-80" />
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  )
}

export const PortalInScrollableDialog: Story = {
  render: () => <ProjectPickerPortalExample />,
}

export const ModalInScrollableDialogPortal: Story = {
  render: () => <ProjectPickerPortalExample modal />,
}

export const DefaultPortalInDialog: Story = {
  render: () => <ProjectPickerPortalExample namedPortal={false} />,
}

export const ModalWithDefaultPortalInDialog: Story = {
  render: () => <ProjectPickerPortalExample modal namedPortal={false} />,
}

export const PortalInTransformedScrollContainer: Story = {
  render: function PortalInTransformedScrollContainerStory() {
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null)
    const [selected, setSelected] = React.useState<SelectPanelItem[]>([])
    const projects = Array.from({length: 20}, (_, index) => ({id: index, text: `Project ${index + 1}`}))

    return (
      <div
        aria-label="Scrolled picker panel"
        role="dialog"
        style={{height: 600, overflow: 'auto', transform: 'translateX(0)'}}
      >
        <span data-prevent-scroll-on-focus tabIndex={-1} />
        <div data-testid="scrolled-picker-portal" ref={setPortalContainer} style={{position: 'relative'}} />
        <div aria-hidden="true" style={{height: 1000}} />
        <SelectPanel
          disableFullscreenOnNarrow
          displayInViewport
          items={projects}
          onSelectedChange={setSelected}
          overlayProps={{container: portalContainer, height: 'large', side: 'bottom', width: 'medium'}}
          selected={selected}
          selectionVariant="multiple"
          setInitialFocus
          showSelectedOptionsFirst={false}
          title="Projects"
        />
      </div>
    )
  },
}

export const ActionMenuAnchor: Story = {
  render: function ActionMenuAnchorStory() {
    const [selected, setSelected] = React.useState<SelectPanelItem | undefined>()

    return (
      <ActionMenu.Root>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Content>
          <SelectPanel
            anchorProps={{nativeButton: false, role: 'menuitem'}}
            items={labels}
            onSelectedChange={setSelected}
            renderAnchor={({children}) => <ActionMenu.Item closeOnClick={false}>{children}</ActionMenu.Item>}
            selected={selected}
            title="Select labels"
          />
        </ActionMenu.Content>
      </ActionMenu.Root>
    )
  },
}

export const WithDefaultMessage: Story = {
  render: () => <ExamplePanel initialSelected={labels.slice(1, 3)} items={labels} />,
}

const renderMoreItems = Array.from({length: 1800}, (_, index) => ({
  description: `Description ${index}`,
  id: index,
  leadingVisual: <ColorCircle color="#a2eeef" />,
  text:
    index === 5
      ? 'This is being used to show what would happen if you returned an item that needed text wrapping'
      : `Item ${index}`,
}))
const virtualizableItems = renderMoreItems.map(item => ({id: item.id, text: item.text}))

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
    <FormControl>
      <FormControl.Label>Render subset of items on initial open</FormControl.Label>
      <FormControl.Caption>{caption}</FormControl.Caption>
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
    </FormControl>
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
          Labels&quot; to open)
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
        <p>Time taken (ms) to render initial {count} items: (click &quot;Select Labels&quot; to open)</p>
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
    <Stack direction="horizontal" gap="normal">
      <form>
        <h3>Without virtualization</h3>
        <p>Time to open (ms): (click to open)</p>
        <ExamplePanel
          initialSelected={[]}
          items={virtualizableItems}
          label={`Labels (${virtualizableItems.length} items)`}
          selectPanelProps={{height: 'large'}}
          title="Select labels"
        />
      </form>
      <form>
        <h3>With virtualization</h3>
        <p>Time to open (ms): (click to open)</p>
        <ExamplePanel
          initialSelected={[]}
          items={virtualizableItems}
          label={`Labels (${virtualizableItems.length} items, virtualized)`}
          selectPanelProps={{height: 'large', virtualized: true}}
          title="Select labels"
        />
      </form>
    </Stack>
  ),
}

const EmojiVisual = () => <SmileyIcon aria-hidden="true" />
const emojiItems = Array.from({length: 400}, (_, index) => {
  const name = index === 3 ? 'emoji-3-with-a-long-descriptive-name-that-wraps-in-the-picker' : `emoji-${index}`
  return {
    'aria-label': name,
    children: (
      <span className="block wrap-break-word" data-emoji-label="">
        {name}
      </span>
    ),
    disabled: index === 398,
    id: name,
    key: name,
    leadingVisual: EmojiVisual,
  }
})

export const VirtualizedEmojiPicker: Story = {
  render: function VirtualizedEmojiPickerStory() {
    const [selected, setSelected] = React.useState<SelectPanelItem | undefined>()
    const selectedEmoji = emojiItems.find(item => item.id === selected?.id)
    return (
      <SelectPanel
        items={emojiItems}
        onSelectedChange={setSelected}
        placeholder="Choose emoji"
        renderAnchor={({children, ...props}) => (
          <Button {...props} leadingVisual={selectedEmoji?.leadingVisual}>
            {children}
          </Button>
        )}
        selected={selected}
        title="Choose emoji"
        virtualized
      />
    )
  },
  play: async ({canvas}) => {
    const trigger = canvas.getByRole('button', {name: 'Choose emoji'})
    await userEvent.click(trigger)
    const dialog = await within(document.body).findByRole('dialog', {name: 'Choose emoji'})
    await expect(within(dialog).getByRole('option', {name: 'emoji-0'})).toHaveAttribute('aria-setsize', '400')
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveFocus()
  },
}
