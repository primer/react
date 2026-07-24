import {Autocomplete as BaseAutocomplete} from '@base-ui/react/autocomplete'
import React from 'react'
import {mergeClassName} from '../ActionList/selectionUtils'

export type AutocompleteRootProps<ItemValue> = BaseAutocomplete.Root.Props<ItemValue>

const Root = BaseAutocomplete.Root

export type AutocompleteInputProps = Omit<BaseAutocomplete.Input.Props, 'data-component'>
const Input = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(function AutocompleteInput(
  {className, ...rest},
  ref,
) {
  return (
    <BaseAutocomplete.Input
      {...rest}
      ref={ref}
      className={mergeClassName(
        'block w-full rounded-md border border-default bg-default px-3 py-1.5 text-sm text-default placeholder:text-muted focus:border-accent-emphasis focus:outline-none focus:ring-2 focus:ring-accent-emphasis',
        className,
      )}
      data-component="Autocomplete.Input"
    />
  )
})

export interface AutocompleteContentProps extends Omit<BaseAutocomplete.Popup.Props, 'data-component'> {
  align?: BaseAutocomplete.Positioner.Props['align']
  side?: BaseAutocomplete.Positioner.Props['side']
  sideOffset?: BaseAutocomplete.Positioner.Props['sideOffset']
  portal?: boolean
}
const Content = React.forwardRef<HTMLDivElement, AutocompleteContentProps>(function AutocompleteContent(
  {align = 'start', children, className, portal = true, side = 'bottom', sideOffset = 4, ...rest},
  ref,
) {
  const popup = (
    <BaseAutocomplete.Positioner
      align={align}
      side={side}
      sideOffset={sideOffset}
      className="z-50"
      data-component="Autocomplete.Positioner"
    >
      <BaseAutocomplete.Popup
        {...rest}
        ref={ref}
        className={mergeClassName(
          'min-w-48 overflow-auto rounded-md border border-default bg-default p-1 shadow-lg outline-none',
          className,
        )}
        data-component="Autocomplete.Content"
      >
        {children}
      </BaseAutocomplete.Popup>
    </BaseAutocomplete.Positioner>
  )
  return portal ? <BaseAutocomplete.Portal>{popup}</BaseAutocomplete.Portal> : popup
})

export type AutocompleteItemProps = Omit<BaseAutocomplete.Item.Props, 'data-component'>
const Item = React.forwardRef<HTMLDivElement, AutocompleteItemProps>(function AutocompleteItem(
  {className, ...rest},
  ref,
) {
  return (
    <BaseAutocomplete.Item
      {...rest}
      ref={ref}
      className={mergeClassName(
        'flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-sm text-default outline-none data-[highlighted]:bg-neutral-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled',
        className,
      )}
      data-component="Autocomplete.Item"
    />
  )
})

const List = React.forwardRef<HTMLDivElement, BaseAutocomplete.List.Props>(function AutocompleteList(
  {className, ...rest},
  ref,
) {
  return (
    <BaseAutocomplete.List
      {...rest}
      ref={ref}
      className={mergeClassName('m-0 max-h-72 list-none overflow-auto p-0', className)}
      data-component="Autocomplete.List"
    />
  )
})

export const Autocomplete = Object.assign(Root, {
  Root,
  Input,
  Trigger: BaseAutocomplete.Trigger,
  InputGroup: BaseAutocomplete.InputGroup,
  Content,
  Popup: Content,
  Positioner: BaseAutocomplete.Positioner,
  Portal: BaseAutocomplete.Portal,
  List,
  Item,
  Group: BaseAutocomplete.Group,
  GroupLabel: BaseAutocomplete.GroupLabel,
  Empty: BaseAutocomplete.Empty,
  Status: BaseAutocomplete.Status,
})
;(Autocomplete as {displayName?: string}).displayName = 'Autocomplete'
