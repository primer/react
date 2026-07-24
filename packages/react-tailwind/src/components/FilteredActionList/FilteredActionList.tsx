import {Combobox} from '@base-ui/react/combobox'
import React from 'react'
import {cn} from '../../internal/cn'
import {mergeClassName} from '../ActionList/selectionUtils'

export interface FilteredActionListItem {
  id: string
  text: React.ReactNode
  /** Text used by Base UI to filter a non-text label. */
  filterValue?: string
  disabled?: boolean
  selected?: boolean
}

type ItemValue = {label: string; value: string}

export interface FilteredActionListProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'className' | 'onChange'> {
  items: readonly FilteredActionListItem[]
  /** Controlled search query. */
  filterValue?: string
  defaultFilterValue?: string
  onFilterChange?: (value: string, eventDetails: Combobox.Root.ChangeEventDetails) => void
  /** Controlled selected IDs. */
  selectedItemIds?: readonly string[]
  defaultSelectedItemIds?: readonly string[]
  onSelectedChange?: (selectedItemIds: string[], eventDetails: Combobox.Root.ChangeEventDetails) => void
  selectionVariant?: 'single' | 'multiple'
  loading?: boolean
  emptyStateText?: React.ReactNode
  placeholderText?: string
  'aria-label'?: string
  className?: string
}

export type FilteredActionListRootProps<Value, Multiple extends boolean | undefined = false> = Combobox.Root.Props<
  Value,
  Multiple
>
const Root = Combobox.Root

const Input = React.forwardRef<HTMLInputElement, Combobox.Input.Props>(function FilteredActionListInput(
  {className, ...rest},
  ref,
) {
  return (
    <Combobox.Input
      {...rest}
      ref={ref}
      className={mergeClassName(
        'block w-full rounded-md border border-default bg-default px-3 py-1.5 text-sm text-default placeholder:text-muted focus:border-accent-emphasis focus:outline-none focus:ring-2 focus:ring-accent-emphasis',
        className,
      )}
      data-component="FilteredActionList.Input"
    />
  )
})

const List = React.forwardRef<HTMLDivElement, Combobox.List.Props>(function FilteredActionListList(
  {className, ...rest},
  ref,
) {
  return (
    <Combobox.List
      {...rest}
      ref={ref}
      className={mergeClassName('m-0 max-h-72 list-none overflow-auto p-1', className)}
      data-component="FilteredActionList.List"
    />
  )
})

const Item = React.forwardRef<HTMLDivElement, Combobox.Item.Props>(function FilteredActionListItemComponent(
  {className, ...rest},
  ref,
) {
  return (
    <Combobox.Item
      {...rest}
      ref={ref}
      className={mergeClassName(
        'flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-sm text-default outline-none data-[highlighted]:bg-neutral-muted data-[selected]:bg-accent-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled',
        className,
      )}
      data-component="FilteredActionList.Item"
    />
  )
})

const Content = React.forwardRef<HTMLDivElement, Combobox.Popup.Props>(function FilteredActionListContent(
  {className, ...rest},
  ref,
) {
  return (
    <Combobox.Portal>
      <Combobox.Positioner className="z-50" sideOffset={4} data-component="FilteredActionList.Positioner">
        <Combobox.Popup
          {...rest}
          ref={ref}
          className={mergeClassName(
            'overflow-hidden rounded-md border border-default bg-default shadow-lg outline-none',
            className,
          )}
          data-component="FilteredActionList.Content"
        />
      </Combobox.Positioner>
    </Combobox.Portal>
  )
})

const FilteredActionList = React.forwardRef<HTMLDivElement, FilteredActionListProps>(function FilteredActionList(
  {
    'aria-label': ariaLabel = 'Filter items',
    className,
    defaultFilterValue,
    defaultSelectedItemIds,
    emptyStateText = 'No items found',
    filterValue,
    items,
    loading = false,
    onFilterChange,
    onSelectedChange,
    placeholderText = 'Filter items',
    selectedItemIds,
    selectionVariant = 'single',
    ...rest
  },
  ref,
) {
  const values = React.useMemo<ItemValue[]>(
    () =>
      items.map(item => ({
        label: item.filterValue ?? (typeof item.text === 'string' ? item.text : item.id),
        value: item.id,
      })),
    [items],
  )
  const itemsById = React.useMemo(() => new Map(items.map(item => [item.id, item])), [items])
  const initialSelected = React.useMemo(
    () => defaultSelectedItemIds ?? items.filter(item => item.selected).map(item => item.id),
    [defaultSelectedItemIds, items],
  )
  const multiple = selectionVariant === 'multiple'
  const selectedValues = selectedItemIds?.map(id => values.find(value => value.value === id)).filter(Boolean) as
    | ItemValue[]
    | undefined
  const defaultValues = initialSelected
    .map(id => values.find(value => value.value === id))
    .filter(Boolean) as ItemValue[]

  return (
    <Combobox.Root
      multiple={multiple}
      defaultOpen
      items={values}
      itemToStringLabel={value => value.label}
      defaultValue={multiple ? defaultValues : (defaultValues[0] ?? null)}
      value={multiple ? selectedValues : selectedItemIds === undefined ? undefined : (selectedValues?.[0] ?? null)}
      defaultInputValue={defaultFilterValue}
      inputValue={filterValue}
      onInputValueChange={(value, details) => {
        onFilterChange?.(value, details)
      }}
      onValueChange={(value, details) => {
        const next = (Array.isArray(value) ? value : value ? [value] : []).map(item => (item as ItemValue).value)
        onSelectedChange?.(next, details)
      }}
    >
      <div {...rest} ref={ref} className={cn('w-full', className)} data-component="FilteredActionList">
        <Input aria-label={ariaLabel} placeholder={placeholderText} />
        <Content>
          {loading ? (
            <div className="p-3 text-sm text-muted" role="status">
              Loading
            </div>
          ) : null}
          {!loading ? (
            <>
              <List>
                {(value: ItemValue) => {
                  const item = itemsById.get(value.value)
                  return item ? (
                    <Item key={item.id} disabled={item.disabled} value={value}>
                      {item.text}
                    </Item>
                  ) : null
                }}
              </List>
              <Combobox.Empty className="p-3 text-sm text-muted">{emptyStateText}</Combobox.Empty>
            </>
          ) : null}
        </Content>
      </div>
    </Combobox.Root>
  )
})

export const FilteredActionListComponent = Object.assign(FilteredActionList, {
  Root,
  Input,
  Content,
  List,
  Item,
  Empty: Combobox.Empty,
  Status: Combobox.Status,
})
;(FilteredActionListComponent as {displayName?: string}).displayName = 'FilteredActionList'
