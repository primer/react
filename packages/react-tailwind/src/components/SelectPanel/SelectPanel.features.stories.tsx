import {
  AlertIcon,
  FilterIcon,
  GearIcon,
  InfoIcon,
  NoteIcon,
  PlusIcon,
  ProjectIcon,
  SearchIcon,
  StopIcon,
  TagIcon,
  TriangleDownIcon,
  TypographyIcon,
  VersionsIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {Button} from '../Button'
import {FormControl} from '../FormControl'
import {SegmentedControl} from '../SegmentedControl'
import {ToggleSwitch} from '../ToggleSwitch'
import {SelectPanel, type SelectPanelItem, type SelectPanelProps} from './SelectPanel'

const meta = {
  title: 'React Tailwind/Components/SelectPanel/Features',
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
  {
    description: 'New feature or request',
    descriptionVariant: 'block',
    id: 1,
    leadingVisual: <ColorCircle color="#a2eeef" />,
    text: 'enhancement',
  },
  {
    description: "Something isn't working",
    descriptionVariant: 'block',
    id: 2,
    leadingVisual: <ColorCircle color="#d73a4a" />,
    text: 'bug',
  },
  {
    description: 'Good for newcomers',
    descriptionVariant: 'block',
    id: 3,
    leadingVisual: <ColorCircle color="#0cf478" />,
    text: 'good first issue',
  },
  {id: 4, leadingVisual: <ColorCircle color="#ffd78e" />, text: 'design'},
  {id: 5, leadingVisual: <ColorCircle color="#ff0000" />, text: 'blocker'},
  {id: 6, leadingVisual: <ColorCircle color="#a4f287" />, text: 'backend'},
  {id: 7, leadingVisual: <ColorCircle color="#8dc6fc" />, text: 'frontend'},
]
const defaultSelectedLabels = labels.slice(1, 3)

function itemText(item: SelectPanelItem) {
  return typeof item.text === 'string' ? item.text : ''
}

function asItems(selection: SelectPanelItem | SelectPanelItem[] | undefined) {
  return Array.isArray(selection) ? selection : selection ? [selection] : []
}

interface LabelsPanelProps {
  initialSelected?: SelectPanelItem | SelectPanelItem[] | null
  label?: React.ReactNode | null
  multiple?: boolean
  panelItems?: readonly SelectPanelItem[]
  selectPanelProps?: StorySelectPanelProps
  title?: string
}

function LabelsPanel({
  initialSelected = defaultSelectedLabels,
  label = 'Labels',
  multiple = true,
  panelItems = labels,
  selectPanelProps,
  title = 'Select labels',
}: LabelsPanelProps) {
  const initialSelection = initialSelected ?? undefined
  const [filterValue, setFilterValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SelectPanelItem | SelectPanelItem[] | undefined>(initialSelection)
  const props = selectPanelProps ?? {}
  const {onCancel, variant = 'anchored', ...restProps} = props
  const currentFilterValue = props.filterValue ?? filterValue
  const filteredItems = panelItems.filter(item =>
    itemText(item).toLowerCase().startsWith(currentFilterValue.toLowerCase()),
  )

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

export const WithItemDividers: Story = {
  render: () => <LabelsPanel selectPanelProps={{showItemDividers: true}} />,
}

export const WithPlaceholderForSearchInput: Story = {
  render: () => <LabelsPanel selectPanelProps={{placeholderText: 'Filter labels'}} />,
}

export const SingleSelect: Story = {
  render: () => <LabelsPanel initialSelected={labels[0]} multiple={false} title="Select an item" />,
}

export const MultiSelect: Story = {
  render: () => <LabelsPanel />,
}

export const WithDisabledItem: Story = {
  render: () => <LabelsPanel panelItems={labels.map(item => (item.id === 4 ? {...item, disabled: true} : item))} />,
}

export const WithExternalAnchor: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<SelectPanelItem[]>(labels.slice(1, 3))
    const anchorRef = React.useRef<HTMLButtonElement>(null)
    return (
      <FormControl>
        <FormControl.Label>Labels</FormControl.Label>
        <Button ref={anchorRef} onClick={() => setOpen(value => !value)} trailingVisual={FilterIcon}>
          {selected.map(itemText).join(', ') || 'Select labels'}
        </Button>
        <SelectPanel
          anchorRef={anchorRef}
          items={labels}
          onOpenChange={setOpen}
          onSelectedChange={next => setSelected(asItems(next))}
          open={open}
          renderAnchor={null}
          selected={selected}
          selectionVariant="multiple"
          title="Select labels"
        />
      </FormControl>
    )
  },
}

export const WithSecondaryActionButton: Story = {
  render: () => (
    <LabelsPanel
      selectPanelProps={{
        overlayProps: {height: 'medium', width: 'small'},
        secondaryAction: <SelectPanel.SecondaryActionButton>Edit labels</SelectPanel.SecondaryActionButton>,
      }}
    />
  ),
}

export const WithSecondaryActionLink: Story = {
  render: () => (
    <LabelsPanel
      selectPanelProps={{
        overlayProps: {height: 'medium', width: 'small'},
        secondaryAction: <SelectPanel.SecondaryActionLink href="#labels">Edit labels</SelectPanel.SecondaryActionLink>,
      }}
    />
  ),
}

export const WithNotice: Story = {
  render: () => {
    const [notice, setNotice] = React.useState<'info' | 'warning' | 'error'>('info')
    const messages = {
      error: "We couldn't load all collaborators. Try again or contact support.",
      info: 'Try a different search term.',
      warning: 'You have reached the limit of assignees on your free account.',
    }
    return (
      <div className="flex flex-col items-start gap-4">
        <FormControl>
          <FormControl.Label>Notice variant</FormControl.Label>
          <SegmentedControl
            aria-label="Notice variant"
            onValueChange={value => setNotice(value[0] as typeof notice)}
            value={[notice]}
          >
            <SegmentedControl.Button value="info" aria-label="Info" leadingVisual={<InfoIcon aria-hidden="true" />}>
              Info notice
            </SegmentedControl.Button>
            <SegmentedControl.Button
              value="warning"
              aria-label="Warning"
              leadingVisual={<AlertIcon aria-hidden="true" />}
            >
              Warning notice
            </SegmentedControl.Button>
            <SegmentedControl.Button value="error" aria-label="Error" leadingVisual={<StopIcon aria-hidden="true" />}>
              Error notice
            </SegmentedControl.Button>
          </SegmentedControl>
        </FormControl>
        <LabelsPanel
          label="SelectPanel with notice"
          selectPanelProps={{notice: {text: messages[notice], variant: notice}}}
        />
      </div>
    )
  },
}

const groupItems: SelectPanelItem[] = [
  {groupId: 'repos', id: 'repo-search', leadingVisual: SearchIcon, text: 'Search repositories'},
  {
    description: 'Some description',
    descriptionVariant: 'block',
    groupId: 'live-query',
    id: 'query-note',
    leadingVisual: NoteIcon,
    text: 'Add a note',
  },
  {
    description: 'Some description as well',
    descriptionVariant: 'block',
    groupId: 'layout',
    id: 'layout-project',
    leadingVisual: ProjectIcon,
    text: 'Project layout',
  },
  {groupId: 'repos', id: 'repo-filter', leadingVisual: FilterIcon, text: 'Save sort and filters to new view'},
  {groupId: 'live-query', id: 'query-settings', leadingVisual: GearIcon, text: 'View settings'},
  {groupId: 'layout', id: 'layout-rename', leadingVisual: TypographyIcon, text: 'Rename'},
  {groupId: 'layout', id: 'layout-duplicate', leadingVisual: VersionsIcon, text: 'Duplicate'},
]

export const WithGroups: Story = {
  render: () => (
    <LabelsPanel
      initialSelected={[]}
      panelItems={groupItems}
      selectPanelProps={{
        groupMetadata: [
          {groupId: 'repos', header: {title: 'Repos', variant: 'filled'}},
          {groupId: 'live-query', header: {title: 'Live query', variant: 'filled'}},
          {groupId: 'layout', header: {title: 'Layout', variant: 'filled'}},
        ],
        overlayProps: {height: 'xlarge', width: 'large'},
      }}
      title="Attach files and symbols"
    />
  ),
}

export const WithLabelVisuallyHidden: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label visuallyHidden>Labels</FormControl.Label>
      <SelectPanel
        items={labels}
        onSelectedChange={() => {}}
        selected={labels.slice(1, 3)}
        selectionVariant="multiple"
        title="Select labels"
      />
    </FormControl>
  ),
}

export const WithLabelInternally: Story = {
  render: () => (
    <LabelsPanel
      label={null}
      selectPanelProps={{
        renderAnchor: ({children}) => (
          <Button trailingVisual={FilterIcon}>
            <span className="mr-1 text-muted">Choices:</span>
            {children || 'None selected'}
          </Button>
        ),
      }}
      title="Choices: selected labels"
    />
  ),
}

function AsyncLabelsPanel({
  label = 'Labels',
  message,
  title = 'Select labels',
}: {
  label?: React.ReactNode | null
  message?: SelectPanelProps['message']
  title?: string
}) {
  const [filterValue, setFilterValue] = React.useState('')
  const [itemsToShow, setItemsToShow] = React.useState<SelectPanelItem[]>([])
  const [loadedFilterValue, setLoadedFilterValue] = React.useState<string | undefined>()
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SelectPanelItem[]>([])

  React.useEffect(() => {
    if (!open) return
    const timeout = window.setTimeout(() => {
      setItemsToShow(labels.filter(item => itemText(item).toLowerCase().startsWith(filterValue.toLowerCase())))
      setLoadedFilterValue(filterValue)
    }, 800)
    return () => window.clearTimeout(timeout)
  }, [filterValue, open])

  return (
    <LabelsPanel
      initialSelected={selected}
      label={label}
      panelItems={itemsToShow}
      selectPanelProps={{
        filterValue,
        loading: open && loadedFilterValue !== filterValue,
        message,
        onFilterChange: setFilterValue,
        onOpenChange: setOpen,
        onSelectedChange: next => setSelected(asItems(next)),
        open,
      }}
      title={title}
    />
  )
}

export const AsyncFetch: Story = {
  render: () => <AsyncLabelsPanel label={null} />,
}

export const CustomisedNoInitialItems: Story = {
  render: () => {
    const [isError, setIsError] = React.useState(false)
    return (
      <>
        <div className="flex h-8 items-center">
          <label className="mr-2 text-[16px] font-semibold" htmlFor="toggle-customised-no-initial-items">
            Enable Error State :{isError ? 'On' : 'Off'}
          </label>
          <span aria-hidden="true" className="mr-2 text-[14px]">
            {isError ? 'On' : 'Off'}
          </span>
          <ToggleSwitch
            checked={isError}
            id="toggle-customised-no-initial-items"
            onCheckedChange={setIsError}
            size="medium"
          />
        </div>
        <div>
          <LabelsPanel
            initialSelected={[]}
            label={null}
            panelItems={[]}
            selectPanelProps={{
              message: isError
                ? {body: 'Something went wrong.', title: 'Oops', variant: 'error'}
                : {
                    action: (
                      <SelectPanel.SecondaryActionLink href="#projects">
                        Start your first project
                      </SelectPanel.SecondaryActionLink>
                    ),
                    body: 'Start your first project to organise your issues.',
                    title: "You haven't created any projects yet",
                    variant: 'empty',
                  },
              overlayProps: {height: 'large'},
              renderAnchor: () => <Button trailingVisual={TriangleDownIcon}>Select Labels</Button>,
            }}
            title="Set projects"
          />
        </div>
      </>
    )
  },
}

export const CustomisedNoResults: Story = {
  render: () => (
    <AsyncLabelsPanel
      label={null}
      message={{
        body: 'Adjust your search term to find other languages',
        title: 'No language found',
        variant: 'empty',
      }}
    />
  ),
}

export const WithOnCancel: Story = {
  render: () => {
    const initialSelection = labels.slice(1, 3)
    const [selected, setSelected] = React.useState<SelectPanelItem[]>(initialSelection)
    return <LabelsPanel initialSelected={selected} selectPanelProps={{onCancel: () => setSelected(initialSelection)}} />
  },
}

export const MultiSelectModal: Story = {
  render: () => {
    const initialSelection = labels.slice(1, 3)
    const [selected, setSelected] = React.useState<SelectPanelItem[]>(initialSelection)
    return (
      <LabelsPanel
        initialSelected={selected}
        label={null}
        selectPanelProps={{
          onCancel: () => setSelected(initialSelection),
          variant: 'modal',
        }}
      />
    )
  },
}

export const SingleSelectModal: Story = {
  render: () => (
    <LabelsPanel
      initialSelected={null}
      label={null}
      multiple={false}
      selectPanelProps={{onCancel: () => {}, variant: 'modal'}}
      title="Select labels"
    />
  ),
}

export const WithInactiveItems: Story = {
  render: () => (
    <LabelsPanel
      panelItems={[
        ...labels,
        {
          description: 'New feature or request',
          descriptionVariant: 'block',
          id: 9,
          inactiveText: 'Currently inactive due to an outage',
          leadingVisual: <ColorCircle color="#00ff00" />,
          text: 'request',
        },
      ]}
    />
  ),
}

export const WithMessage: Story = {
  render: () => {
    const [variant, setVariant] = React.useState<'default' | 'empty' | 'error' | 'warning'>('default')
    const messages: Record<Exclude<typeof variant, 'default'>, SelectPanelProps['message']> = {
      empty: {
        action: (
          <Button leadingVisual={PlusIcon} size="small">
            Create new label
          </Button>
        ),
        body: 'Try adjusting your search or create a new label',
        icon: TagIcon,
        title: 'No labels found',
        variant: 'empty',
      },
      error: {
        body: 'Check your network connection and try again.',
        title: 'Failed to load labels',
        variant: 'error',
      },
      warning: {
        body: 'Consider refreshing to get the latest data.',
        title: 'Some labels may be outdated',
        variant: 'warning',
      },
    }
    return (
      <div className="flex flex-col items-start gap-4">
        <FormControl>
          <FormControl.Label>Message variant</FormControl.Label>
          <SegmentedControl
            aria-label="Message variant"
            onValueChange={value => setVariant(value[0] as typeof variant)}
            value={[variant]}
          >
            <SegmentedControl.Button value="default">Default message</SegmentedControl.Button>
            <SegmentedControl.Button value="empty">Empty</SegmentedControl.Button>
            <SegmentedControl.Button value="error">Error</SegmentedControl.Button>
            <SegmentedControl.Button value="warning">Warning</SegmentedControl.Button>
          </SegmentedControl>
        </FormControl>
        <LabelsPanel
          initialSelected={[]}
          label="SelectPanel with message"
          panelItems={variant === 'default' ? labels.slice(0, 3) : []}
          selectPanelProps={{
            message: variant === 'default' ? undefined : messages[variant],
            overlayProps: {height: 'medium'},
          }}
        />
      </div>
    )
  },
}

export const WithSelectAll: Story = {
  render: () => <LabelsPanel initialSelected={[]} selectPanelProps={{showSelectAll: true}} />,
}
