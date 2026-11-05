import {CheckboxGroup as BaseCheckboxGroup} from '@base-ui/react/checkbox-group'
import React from 'react'
import {cn} from '../../internal/cn'
import {ValidationMessage} from '../../internal/ValidationMessage'

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, 'className' | 'data-component'> {
  className?: BaseCheckboxGroup.Props['className']
}

export interface CheckboxGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hides the label visually while keeping it available to assistive technology. */
  visuallyHidden?: boolean
}

const Label = React.forwardRef<HTMLDivElement, CheckboxGroupLabelProps>(function Label(
  {children, className, visuallyHidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      data-component="CheckboxGroup.Label"
      className={cn('block text-sm font-semibold text-default', visuallyHidden && 'sr-only', className)}
    >
      {children}
    </div>
  )
})

const Caption = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(function Caption(
  {children, className, ...rest},
  ref,
) {
  return (
    <p
      {...rest}
      ref={ref}
      data-component="CheckboxGroup.Caption"
      className={cn(
        // Upstream renders the caption inside the legend, directly under a visible label.
        'm-0 text-sm leading-6 text-muted [[data-component$=Label]:not(.sr-only)+&]:-mt-2',
        className,
      )}
    >
      {children}
    </p>
  )
})

export interface CheckboxGroupValidationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the message reports a problem or confirms success. */
  variant: 'error' | 'success'
}

const Validation = React.forwardRef<HTMLDivElement, CheckboxGroupValidationProps>(function Validation(
  {children, className, variant, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      role={variant === 'success' ? 'status' : 'alert'}
      data-component="CheckboxGroup.Validation"
      data-variant={variant}
      className={ValidationMessage.getClassName(variant, className)}
    >
      <ValidationMessage variant={variant}>{children}</ValidationMessage>
    </div>
  )
})

/** Groups checkbox primitives and supplies controlled or uncontrolled values. */
const Root = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  {children, className, ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseCheckboxGroup.State) => cn('m-0 grid min-w-0 gap-2', className(state))
      : cn('m-0 grid min-w-0 gap-2', className)

  return (
    <BaseCheckboxGroup {...rest} ref={ref} data-component="CheckboxGroup" className={mergedClassName}>
      {children}
    </BaseCheckboxGroup>
  )
})

export const CheckboxGroup = Object.assign(Root, {Label, Caption, Validation})

CheckboxGroup.displayName = 'CheckboxGroup'
