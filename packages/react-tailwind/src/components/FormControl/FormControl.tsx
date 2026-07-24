import {Field} from '@base-ui/react/field'
import React from 'react'
import {cn} from '../../internal/cn'
import {FormControlContextProvider} from './useFormControlForwardedProps'

export interface FormControlProps extends Omit<Field.Root.Props, 'className' | 'data-component'> {
  className?: Field.Root.Props['className']
  layout?: 'horizontal' | 'vertical'
}

const Root = React.forwardRef<HTMLDivElement, FormControlProps>(function FormControl(
  {className, layout = 'vertical', ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Root.State) =>
          cn(layout === 'horizontal' ? 'flex items-start gap-2' : 'grid gap-2', className(state))
      : cn(layout === 'horizontal' ? 'flex items-start gap-2' : 'grid gap-2', className)
  const context = React.useMemo(() => ({disabled: rest.disabled, name: rest.name}), [rest.disabled, rest.name])

  return (
    <FormControlContextProvider value={context}>
      <Field.Root {...rest} ref={ref} data-component="FormControl" data-layout={layout} className={mergedClassName} />
    </FormControlContextProvider>
  )
})

export interface FormControlLabelProps extends Omit<Field.Label.Props, 'className' | 'data-component'> {
  className?: Field.Label.Props['className']
  visuallyHidden?: boolean
  requiredIndicator?: boolean
  requiredText?: string
}

const Label = React.forwardRef<HTMLElement, FormControlLabelProps>(function Label(
  {className, requiredIndicator, requiredText = 'Required', visuallyHidden, children, ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Label.State) =>
          cn(
            'text-sm font-medium text-default data-[disabled]:text-muted',
            visuallyHidden && 'sr-only',
            className(state),
          )
      : cn('text-sm font-medium text-default data-[disabled]:text-muted', visuallyHidden && 'sr-only', className)

  return (
    <Field.Label {...rest} ref={ref} data-component="FormControl.Label" className={mergedClassName}>
      {children}
      {requiredIndicator && (
        <>
          <span aria-hidden="true"> *</span>
          <span className="sr-only">{requiredText}</span>
        </>
      )}
    </Field.Label>
  )
})

export interface FormControlCaptionProps extends Omit<Field.Description.Props, 'className' | 'data-component'> {
  className?: Field.Description.Props['className']
}
const Caption = React.forwardRef<HTMLParagraphElement, FormControlCaptionProps>(function Caption(
  {className, ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Description.State) => cn('text-sm text-muted', className(state))
      : cn('text-sm text-muted', className)

  return <Field.Description {...rest} ref={ref} data-component="FormControl.Caption" className={mergedClassName} />
})

export interface FormControlValidationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'data-component'> {
  className?: string
  variant: 'error' | 'success'
}
const Validation = React.forwardRef<HTMLDivElement, FormControlValidationProps>(function Validation(
  {children, className, variant, ...rest},
  ref,
) {
  const validationClassName = cn('text-sm', variant === 'error' ? 'text-danger' : 'text-success', className)

  if (variant === 'success') {
    return (
      <div
        {...rest}
        ref={ref}
        role="status"
        data-component="FormControl.Validation"
        data-variant={variant}
        className={validationClassName}
      >
        {children}
      </div>
    )
  }

  return (
    <Field.Error
      {...rest}
      ref={ref}
      match
      data-component="FormControl.Validation"
      data-variant={variant}
      className={validationClassName}
    >
      {children}
    </Field.Error>
  )
})

export type FormControlLeadingVisualProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'data-component'>
const LeadingVisual = React.forwardRef<HTMLDivElement, FormControlLeadingVisualProps>(function LeadingVisual(
  {className, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      data-component="FormControl.LeadingVisual"
      className={cn('shrink-0 text-muted', className)}
    />
  )
})

export type FormControlControlProps = Omit<Field.Control.Props, 'data-component'>
const Control = React.forwardRef<HTMLElement, FormControlControlProps>(function Control(props, ref) {
  return <Field.Control {...props} ref={ref} data-component="FormControl.Control" />
})

/**
 * A Field.Root config component with composable label, caption, validation, and visual pieces.
 * Compose its children in the needed semantic order; no consumer children are extracted or moved.
 */
export const FormControl = Object.assign(Root, {Label, Caption, Validation, LeadingVisual, Control})
