'use client'

import {Autocomplete as BaseAutocomplete} from '@base-ui/react/autocomplete'
import React from 'react'
import {mergeClassName} from '../../internal/mergeClassName'
import type {FloatingContentProps} from '../../utils/types'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {FloatingPortalParentContext, useFloatingPortalContainer} from '../../internal/portalRoot'
import {TextInput, type TextInputProps} from '../TextInput'

export type AutocompleteRootProps<ItemValue> = BaseAutocomplete.Root.Props<ItemValue>

// A distinct function keeps the attached parts off Base UI's exported `Autocomplete.Root`; the cast keeps its overloads.
const Root = function AutocompleteRoot(props: AutocompleteRootProps<unknown>) {
  return <BaseAutocomplete.Root {...props} />
} as typeof BaseAutocomplete.Root

export interface AutocompleteInputProps
  extends Omit<BaseAutocomplete.Input.Props, 'data-component' | 'render' | 'size'>,
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
      className={mergeClassName('primer:z-popover', positionerClassName)}
      data-component="Autocomplete.Positioner"
    >
      <BaseAutocomplete.Popup
        {...rest}
        ref={ref}
        className={mergeClassName(
          'primer:min-w-48 primer:overflow-auto primer:rounded-md primer:border-thin primer:border-default primer:bg-default primer:p-1 primer:shadow-floating-lg primer:outline-none',
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
  const portalContainer = useFloatingPortalContainer(container)
  return (
    <BaseAutocomplete.Portal {...rest} container={portalContainer}>
      <FloatingPortalParentContext.Provider value>{children}</FloatingPortalParentContext.Provider>
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
        'primer:flex primer:w-full primer:cursor-default primer:items-center primer:rounded-md primer:px-2 primer:py-1.5 primer:text-sm primer:text-default primer:outline-none primer:data-[highlighted]:bg-neutral-muted primer:data-[disabled]:cursor-not-allowed primer:data-[disabled]:text-disabled',
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
      className={mergeClassName(
        'primer:m-0 primer:max-h-72 primer:list-none primer:overflow-auto primer:p-0',
        className,
      )}
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
  Portal,
  List,
  Item,
  Group: BaseAutocomplete.Group,
  GroupLabel: BaseAutocomplete.GroupLabel,
  Empty: BaseAutocomplete.Empty,
  Status: BaseAutocomplete.Status,
})
;(Autocomplete as {displayName?: string}).displayName = 'Autocomplete'
