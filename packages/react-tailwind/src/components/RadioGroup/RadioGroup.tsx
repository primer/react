import {RadioGroup as BaseRadioGroup} from '@base-ui/react/radio-group'
import React from 'react'
import {cn} from '../../internal/cn'
import {ValidationMessage} from '../../internal/ValidationMessage'

export interface RadioGroupProps<Value = string>
  extends Omit<BaseRadioGroup.Props<Value>, 'className' | 'data-component'> {
  className?: BaseRadioGroup.Props<Value>['className']
}

export interface RadioGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hides the label visually while keeping it available to assistive technology. */
  visuallyHidden?: boolean
}

const Label = React.forwardRef<HTMLDivElement, RadioGroupLabelProps>(function Label(
  {children, className, visuallyHidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      data-component="RadioGroup.Label"
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
      data-component="RadioGroup.Caption"
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

export interface RadioGroupValidationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the message reports a problem or confirms success. */
  variant: 'error' | 'success'
}

const Validation = React.forwardRef<HTMLDivElement, RadioGroupValidationProps>(function Validation(
  {children, className, variant, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      role={variant === 'success' ? 'status' : 'alert'}
      data-component="RadioGroup.Validation"
      data-variant={variant}
      className={ValidationMessage.getClassName(variant, className)}
    >
      <ValidationMessage variant={variant}>{children}</ValidationMessage>
    </div>
  )
})

/** Groups Radio primitives and implements roving keyboard focus. */
const Root = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {children, className, ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseRadioGroup.State) => cn('m-0 grid min-w-0 gap-2', className(state))
      : cn('m-0 grid min-w-0 gap-2', className)

  return (
    <BaseRadioGroup {...rest} ref={ref} data-component="RadioGroup" className={mergedClassName}>
      {children}
    </BaseRadioGroup>
  )
})

export const RadioGroup = Object.assign(Root, {Label, Caption, Validation})

RadioGroup.displayName = 'RadioGroup'
