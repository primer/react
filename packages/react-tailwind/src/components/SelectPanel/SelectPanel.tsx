import {Combobox} from '@base-ui/react/combobox'
import {Popover} from '@base-ui/react/popover'
import {TriangleDownIcon, XIcon} from '@primer/octicons-react'
import React from 'react'
import {Button, ButtonBase} from '../Button'
import {mergeClassName} from '../ActionList/selectionUtils'

export type SelectPanelRootProps = Popover.Root.Props
const Root = Popover.Root

export type SelectPanelTriggerProps = Omit<Popover.Trigger.Props, 'data-component' | 'render'>
const Trigger = React.forwardRef<HTMLButtonElement, SelectPanelTriggerProps>(function SelectPanelTrigger(
  {className, ...rest},
  ref,
) {
  return (
    <Popover.Trigger
      {...rest}
      ref={ref}
      className={className}
      render={<ButtonBase data-component="SelectPanel.Trigger" />}
    />
  )
})

export interface SelectPanelContentProps extends Omit<Popover.Popup.Props, 'data-component'> {
  align?: Popover.Positioner.Props['align']
  side?: Popover.Positioner.Props['side']
  sideOffset?: Popover.Positioner.Props['sideOffset']
  portal?: boolean
}
const Content = React.forwardRef<HTMLDivElement, SelectPanelContentProps>(function SelectPanelContent(
  {align = 'start', children, className, portal = true, side = 'bottom', sideOffset = 4, ...rest},
  ref,
) {
  const popup = (
    <Popover.Positioner
      align={align}
      side={side}
      sideOffset={sideOffset}
      className="z-popover"
      data-component="SelectPanel.Positioner"
    >
      <Popover.Popup
        {...rest}
        ref={ref}
        className={mergeClassName(
          'w-80 overflow-hidden rounded-md border border-default bg-default shadow-floating-lg outline-none',
          className,
        )}
        data-component="SelectPanel.Content"
      >
        {children}
      </Popover.Popup>
    </Popover.Positioner>
  )
  return portal ? <Popover.Portal>{popup}</Popover.Portal> : popup
})

export interface SelectPanelItem {
  id: string
  text: React.ReactNode
  /** Text used by Base UI to filter a non-text label. */
  filterValue?: string
  disabled?: boolean
}

type SelectPanelValue = {label: string; value: string}
type SelectPanelSelectedChangeDetails = Combobox.Root.ChangeEventDetails
type SelectPanelOpenChangeDetails = Popover.Root.ChangeEventDetails

export interface SelectPanelProps {
  items: readonly SelectPanelItem[]
  selected: SelectPanelItem | readonly SelectPanelItem[] | undefined
  onSelectedChange: (
    selected: SelectPanelItem | SelectPanelItem[] | undefined,
    details: SelectPanelSelectedChangeDetails,
  ) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: SelectPanelOpenChangeDetails) => void
  title?: React.ReactNode
  subtitle?: React.ReactNode
  placeholder?: string
  placeholderText?: string
  inputLabel?: string
  selectionVariant?: 'single' | 'multiple'
  className?: string
  emptyStateText?: React.ReactNode
}

/**
 * An opinionated, data-driven SelectPanel. Consumers that need custom layout
 * can compose Root, Trigger, and Content directly. Its configured list composes
 * Base UI's combobox so filtering, active descendants, and option keyboard
 * behavior are owned by one accessibility primitive.
 */
function SelectPanelConfig({
  className,
  defaultOpen = false,
  emptyStateText = 'No items found',
  inputLabel,
  items,
  onOpenChange,
  onSelectedChange,
  open: controlledOpen,
  placeholder,
  placeholderText = 'Filter items',
  selected,
  selectionVariant,
  subtitle,
  title,
}: SelectPanelProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const multiple = selectionVariant === 'multiple' || Array.isArray(selected)
  const selectedItems = Array.isArray(selected) ? selected : selected ? [selected] : []
  const values = React.useMemo<SelectPanelValue[]>(
    () =>
      items.map(item => ({
        label: item.filterValue ?? (typeof item.text === 'string' ? item.text : item.id),
        value: item.id,
      })),
    [items],
  )
  const itemsById = React.useMemo(() => new Map(items.map(item => [item.id, item])), [items])
  const selectedValues = selectedItems
    .map(item => values.find(value => value.value === item.id))
    .filter(Boolean) as SelectPanelValue[]

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (controlledOpen === undefined) setUncontrolledOpen(nextOpen)
        onOpenChange?.(nextOpen, details)
      }}
    >
      <Popover.Trigger
        render={
          <Button trailingVisual={<TriangleDownIcon aria-hidden="true" />} data-component="SelectPanel.Button">
            {selectedItems.length
              ? selectedItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 ? ', ' : null}
                    {item.text}
                  </React.Fragment>
                ))
              : (placeholder ?? title ?? 'Select')}
          </Button>
        }
      />
      <Content className={className}>
        <Combobox.Root
          multiple={multiple}
          inline
          open={open}
          items={values}
          itemToStringLabel={value => value.label}
          value={multiple ? selectedValues : (selectedValues[0] ?? null)}
          onValueChange={(value, details) => {
            const selectedIds = (Array.isArray(value) ? value : value ? [value] : []).map(item => item.value)
            const nextItems = selectedIds
              .map(id => itemsById.get(id))
              .filter((item): item is SelectPanelItem => item !== undefined)
            onSelectedChange(multiple ? nextItems : nextItems[0], details)
          }}
        >
          <div className="border-b border-default p-3">
            {title ? <h2 className="text-sm font-semibold text-default">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
            <Combobox.Input
              aria-label={inputLabel ?? placeholderText}
              placeholder={placeholderText}
              className="mt-2 block w-full rounded-md border border-default bg-default px-3 py-1.5 text-sm text-default placeholder:text-muted focus:border-accent-emphasis focus:outline-none focus:ring-2 focus:ring-accent-emphasis"
              data-component="SelectPanel.Filter"
            />
          </div>
          <Combobox.List className="m-0 max-h-72 list-none overflow-auto p-1" data-component="SelectPanel.List">
            {(value: SelectPanelValue) => {
              const item = itemsById.get(value.value)
              if (!item) return null

              const option = (
                <Combobox.Item
                  key={item.id}
                  disabled={item.disabled}
                  value={value}
                  className="flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-left text-sm text-default outline-none data-[highlighted]:bg-neutral-muted data-[selected]:bg-accent-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled"
                  data-component="SelectPanel.Item"
                >
                  {item.text}
                </Combobox.Item>
              )

              return multiple ? (
                option
              ) : (
                <Popover.Close key={item.id} nativeButton={false} role="option" render={option} />
              )
            }}
          </Combobox.List>
          <Combobox.Empty className="p-3 text-sm text-muted">{emptyStateText}</Combobox.Empty>
        </Combobox.Root>
      </Content>
    </Popover.Root>
  )
}

export const SelectPanel = Object.assign(SelectPanelConfig, {
  Root,
  Trigger,
  Content,
  Popup: Content,
  Close: Popover.Close,
  Title: Popover.Title,
  Description: Popover.Description,
  Item: Combobox.Item,
  ClearIcon: XIcon,
})
;(SelectPanel as {displayName?: string}).displayName = 'SelectPanel'
