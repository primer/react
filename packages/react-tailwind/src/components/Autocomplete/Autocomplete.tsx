'use client'

import {Autocomplete as BaseAutocomplete} from '@base-ui/react/autocomplete'
import React from 'react'
import {mergeClassName} from '../../internal/mergeClassName'
import type {FloatingContentProps} from '../../utils/types'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {usePortalContainer} from '../../internal/portalRoot'
import {TextInput, type TextInputProps} from '../TextInput'

export type AutocompleteRootProps<ItemValue> = BaseAutocomplete.Root.Props<ItemValue>

// A distinct function keeps the attached parts off Base UI's exported `Autocomplete.Root`; the cast keeps its overloads.
const Root = function AutocompleteRoot(props: AutocompleteRootProps<unknown>) {
  return <BaseAutocomplete.Root {...props} />
} as typeof BaseAutocomplete.Root

export interface AutocompleteInputProps
  extends Omit<BaseAutocomplete.Input.Props, 'data-component' | 'size'>,
    Pick<
      TextInputProps,
      | 'block'
      | 'leadingVisual'
      | 'loaderPosition'
      | 'loaderText'
      | 'loading'
      | 'monospace'
      | 'size'
      | 'trailingAction'
      | 'trailingVisual'
      | 'validationStatus'
    > {}

/** The combobox input, rendered as a `TextInput` so it shares field styling, visuals, and FormControl wiring. */
const Input = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(function AutocompleteInput(
  {
    block,
    leadingVisual,
    loaderPosition,
    loaderText,
    loading,
    monospace,
    render,
    size,
    trailingAction,
    trailingVisual,
    validationStatus,
    ...rest
  },
  ref,
) {
  return (
    <BaseAutocomplete.Input
      {...rest}
      ref={ref}
      data-component="Autocomplete.Input"
      render={
        render ?? (
          <TextInput
            block={block}
            leadingVisual={leadingVisual}
            loaderPosition={loaderPosition}
            loaderText={loaderText}
            loading={loading}
            monospace={monospace}
            size={size}
            trailingAction={trailingAction}
            trailingVisual={trailingVisual}
            validationStatus={validationStatus}
          />
        )
      }
    />
  )
})

export interface AutocompleteContentProps
  extends Omit<BaseAutocomplete.Popup.Props, 'data-component'>,
    FloatingContentProps {}
const Content = React.forwardRef<HTMLDivElement, AutocompleteContentProps>(function AutocompleteContent(
  {
    align = 'start',
    alignOffset,
    anchor,
    children,
    className,
    portal = true,
    positionerClassName,
    side = 'bottom',
    sideOffset = 4,
    ...rest
  },
  ref,
) {
  const popup = (
    <BaseAutocomplete.Positioner
      align={align}
      alignOffset={alignOffset}
      anchor={anchor}
      side={side}
      sideOffset={sideOffset}
      className={mergeClassName('z-popover', positionerClassName)}
      data-component="Autocomplete.Positioner"
    >
      <BaseAutocomplete.Popup
        {...rest}
        ref={ref}
        className={mergeClassName(
          'min-w-48 overflow-auto rounded-md border border-default bg-default p-1 shadow-floating-lg outline-none',
          className,
        )}
        data-component="Autocomplete.Content"
      >
        {children}
      </BaseAutocomplete.Popup>
    </BaseAutocomplete.Positioner>
  )
  return (
    <FloatingPortal part={Portal} portal={portal}>
      {popup}
    </FloatingPortal>
  )
})

function Portal({children, container, ...rest}: BaseAutocomplete.Portal.Props) {
  const portalContainer = usePortalContainer(container)
  return (
    <BaseAutocomplete.Portal {...rest} container={portalContainer}>
      {children}
    </BaseAutocomplete.Portal>
  )
}

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

const useFilteredItems: <T>() => T[] = BaseAutocomplete.useFilteredItems

export const Autocomplete = Object.assign(Root, {
  Root,
  Input,
  Trigger: BaseAutocomplete.Trigger,
  InputGroup: BaseAutocomplete.InputGroup,
  Content,
  Popup: Content,
  Positioner: BaseAutocomplete.Positioner,
  Portal,
  List,
  Item,
  Group: BaseAutocomplete.Group,
  GroupLabel: BaseAutocomplete.GroupLabel,
  Empty: BaseAutocomplete.Empty,
  Status: BaseAutocomplete.Status,
  useFilter: BaseAutocomplete.useFilter,
  useFilteredItems,
})
;(Autocomplete as {displayName?: string}).displayName = 'Autocomplete'
