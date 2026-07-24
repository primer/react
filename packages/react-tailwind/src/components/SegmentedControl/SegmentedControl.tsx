import {ToggleGroup} from '@base-ui/react/toggle-group'
import {Toggle} from '@base-ui/react/toggle'
import React from 'react'
import {cn} from '../../internal/cn'
import {ButtonBase} from '../Button'

export interface SegmentedControlProps<Value extends string = string>
  extends Omit<ToggleGroup.Props<Value>, 'className' | 'data-component' | 'multiple'> {
  className?: ToggleGroup.Props<Value>['className']
}

const Root = React.forwardRef<HTMLDivElement, SegmentedControlProps>(function Root({className, ...rest}, ref) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: ToggleGroup.State) =>
          cn('inline-flex h-8 rounded-md border border-default bg-muted p-0.5', className(state))
      : cn('inline-flex h-8 rounded-md border border-default bg-muted p-0.5', className)

  return <ToggleGroup {...rest} ref={ref} data-component="SegmentedControl" className={mergedClassName} />
})

export interface SegmentedControlButtonProps<Value extends string = string>
  extends Omit<Toggle.Props<Value>, 'className' | 'children' | 'data-component' | 'render'> {
  className?: Toggle.Props<Value>['className']
  children?: React.ReactNode
  leadingVisual?: React.ReactNode
  count?: number | string
}

const Button = React.forwardRef<HTMLButtonElement, SegmentedControlButtonProps>(function Button(
  {children, className, count, leadingVisual, ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: Toggle.State) =>
          cn(
            'inline-flex h-7 appearance-none items-center justify-center gap-1.5 rounded-sm bg-transparent px-2 text-sm text-default outline-none data-[pressed]:bg-default data-[pressed]:shadow-resting-xs data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:outline-2 focus-visible:outline-focus',
            className(state),
          )
      : cn(
          'inline-flex h-7 appearance-none items-center justify-center gap-1.5 rounded-sm bg-transparent px-2 text-sm text-default outline-none data-[pressed]:bg-default data-[pressed]:shadow-resting-xs data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:outline-2 focus-visible:outline-focus',
          className,
        )

  return (
    <Toggle
      {...rest}
      ref={ref}
      data-component="SegmentedControl.Button"
      className={mergedClassName}
      render={<ButtonBase data-component="SegmentedControl.Button" />}
    >
      {leadingVisual}
      {children}
      {count !== undefined && <span className="rounded-full bg-neutral-muted px-1 text-xs">{count}</span>}
    </Toggle>
  )
})

export interface SegmentedControlIconButtonProps<Value extends string = string>
  extends Omit<SegmentedControlButtonProps<Value>, 'children' | 'leadingVisual'> {
  'aria-label': string
  icon: React.ElementType
}

const IconButton = React.forwardRef<HTMLButtonElement, SegmentedControlIconButtonProps>(function IconButton(
  {icon: Icon, ...rest},
  ref,
) {
  return <Button {...rest} ref={ref} leadingVisual={<Icon aria-hidden="true" />} />
})

/** A single-choice Base UI toggle group. Compose Button and IconButton children in author order. */
export const SegmentedControl = Object.assign(Root, {Button, IconButton})
