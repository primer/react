import {Select as BaseSelect} from '@base-ui/react/select'
import {CheckIcon, TriangleDownIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {ButtonBase} from '../Button'

export type SelectProps<Value = string, Multiple extends boolean | undefined = false> = Omit<
  BaseSelect.Root.Props<Value, Multiple>,
  'data-component'
>

/** The unstyled state root for a composable select. */
function Root<Value, Multiple extends boolean | undefined = false>(props: SelectProps<Value, Multiple>) {
  return <BaseSelect.Root {...props} />
}

export interface SelectTriggerProps
  extends Omit<BaseSelect.Trigger.Props, 'className' | 'children' | 'data-component' | 'render'> {
  className?: BaseSelect.Trigger.Props['className']
  children?: React.ReactNode
}

const Trigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(function Trigger(
  {className, children, ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseSelect.Trigger.State) =>
          cn(
            'flex h-8 w-full items-center justify-between gap-2 rounded-md border border-default bg-default px-3 text-left text-sm text-default shadow-resting-xs outline-none data-[placeholder]:text-muted data-[disabled]:cursor-not-allowed data-[disabled]:bg-disabled data-[disabled]:text-muted focus-visible:border-accent-emphasis focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-focus',
            className(state),
          )
      : cn(
          'flex h-8 w-full items-center justify-between gap-2 rounded-md border border-default bg-default px-3 text-left text-sm text-default shadow-resting-xs outline-none data-[placeholder]:text-muted data-[disabled]:cursor-not-allowed data-[disabled]:bg-disabled data-[disabled]:text-muted focus-visible:border-accent-emphasis focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-focus',
          className,
        )

  return (
    <BaseSelect.Trigger
      {...rest}
      ref={ref}
      data-component="Select.Trigger"
      className={mergedClassName}
      render={<ButtonBase data-component="Select.Trigger" />}
    >
      {children}
      <BaseSelect.Icon>
        <TriangleDownIcon aria-hidden="true" size={16} />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
})

export interface SelectValueProps extends Omit<BaseSelect.Value.Props, 'className' | 'data-component'> {
  className?: BaseSelect.Value.Props['className']
}
const Value = React.forwardRef<HTMLSpanElement, SelectValueProps>(function Value({className, ...rest}, ref) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseSelect.Value.State) => cn('min-w-0 truncate', className(state))
      : cn('min-w-0 truncate', className)

  return <BaseSelect.Value {...rest} ref={ref} data-component="Select.Value" className={mergedClassName} />
})

export interface SelectPopupProps extends Omit<BaseSelect.Popup.Props, 'className' | 'data-component'> {
  className?: BaseSelect.Popup.Props['className']
}
const Popup = React.forwardRef<HTMLDivElement, SelectPopupProps>(function Popup({className, ...rest}, ref) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseSelect.Popup.State) =>
          cn(
            'z-popover min-w-[var(--anchor-width)] rounded-md border border-default bg-default p-1 shadow-floating-sm',
            className(state),
          )
      : cn(
          'z-popover min-w-[var(--anchor-width)] rounded-md border border-default bg-default p-1 shadow-floating-sm',
          className,
        )

  return <BaseSelect.Popup {...rest} ref={ref} data-component="Select.Popup" className={mergedClassName} />
})

export interface SelectItemProps extends Omit<BaseSelect.Item.Props, 'className' | 'children' | 'data-component'> {
  className?: BaseSelect.Item.Props['className']
  children?: React.ReactNode
}
const Item = React.forwardRef<HTMLElement, SelectItemProps>(function Item({className, children, ...rest}, ref) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseSelect.Item.State) =>
          cn(
            'flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm text-default outline-none data-[highlighted]:bg-accent-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-muted',
            className(state),
          )
      : cn(
          'flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm text-default outline-none data-[highlighted]:bg-accent-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-muted',
          className,
        )

  return (
    <BaseSelect.Item {...rest} ref={ref} data-component="Select.Item" className={mergedClassName}>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator>
        <CheckIcon aria-hidden="true" size={16} />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  )
})

/** A presentational, composable select built from Base UI's form-associated primitive. */
export const Select = Object.assign(Root, {
  Trigger,
  Value,
  Portal: BaseSelect.Portal,
  Positioner: BaseSelect.Positioner,
  Popup,
  List: BaseSelect.List,
  Item,
  Group: BaseSelect.Group,
  GroupLabel: BaseSelect.GroupLabel,
})
