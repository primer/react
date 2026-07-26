'use client'

import {Field} from '@base-ui/react/field'
import React from 'react'
import {flattenChildren} from '../../internal/children'
import {cn} from '../../internal/cn'
import {ValidationMessage} from '../../internal/ValidationMessage'
import {FormControlContextProvider, useFormControlContext} from './useFormControlForwardedProps'

export interface FormControlProps extends Omit<Field.Root.Props, 'className' | 'data-component'> {
  className?: Field.Root.Props['className']
  layout?: 'horizontal' | 'vertical'
  required?: boolean
}

const FormControlLayoutContext = React.createContext<FormControlProps['layout']>('vertical')

const Root = React.forwardRef<HTMLDivElement, FormControlProps>(function FormControl(
  {children, className, id: idProp, layout = 'vertical', required = false, ...rest},
  ref,
) {
  const generatedId = React.useId()
  const controlId = idProp ?? generatedId
  const childArray = flattenChildren(children)
  const hasCaption = childArray.some(child => React.isValidElement(child) && child.type === Caption)
  const hasLeadingVisual = childArray.some(child => React.isValidElement(child) && child.type === LeadingVisual)
  const hasValidation = childArray.some(child => React.isValidElement(child) && child.type === Validation)
  const hasErrorValidation = childArray.some(
    child =>
      React.isValidElement<FormControlValidationProps>(child) &&
      child.type === Validation &&
      child.props.variant === 'error',
  )
  const captionId = hasCaption ? `${controlId}-caption` : undefined
  const validationId = hasValidation ? `${controlId}-validation` : undefined
  const describedBy = [validationId, captionId].filter(Boolean).join(' ') || undefined
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Root.State) =>
          cn(
            layout === 'horizontal'
              ? cn(
                  'grid gap-0 [&>[data-component="Checkbox"]]:col-start-1 [&>[data-component="Checkbox"]]:row-start-1 [&>[data-component="Radio"]]:col-start-1 [&>[data-component="Radio"]]:row-start-1 [&>[data-component="FormControl.Caption"]]:row-start-2 [&>[data-component="FormControl.Label"]]:row-start-1 [&>[data-component="FormControl.LeadingVisual"]]:col-start-2 [&>[data-component="FormControl.LeadingVisual"]]:row-start-1 [&>[data-component="FormControl.Validation"]]:row-start-3',
                  hasLeadingVisual
                    ? 'grid-cols-[auto_auto_minmax(0,1fr)] items-center [&>[data-component="FormControl.Caption"]]:col-start-3 [&>[data-component="FormControl.Label"]]:col-start-3 [&>[data-component="FormControl.Validation"]]:col-start-3'
                    : 'grid-cols-[auto_minmax(0,1fr)] items-start [&>[data-component="FormControl.Caption"]]:col-start-2 [&>[data-component="FormControl.Label"]]:col-start-2 [&>[data-component="FormControl.Validation"]]:col-start-2',
                )
              : 'flex flex-col items-start gap-1',
            className(state),
          )
      : cn(
          layout === 'horizontal'
            ? cn(
                'grid gap-0 [&>[data-component="Checkbox"]]:col-start-1 [&>[data-component="Checkbox"]]:row-start-1 [&>[data-component="Radio"]]:col-start-1 [&>[data-component="Radio"]]:row-start-1 [&>[data-component="FormControl.Caption"]]:row-start-2 [&>[data-component="FormControl.Label"]]:row-start-1 [&>[data-component="FormControl.LeadingVisual"]]:col-start-2 [&>[data-component="FormControl.LeadingVisual"]]:row-start-1 [&>[data-component="FormControl.Validation"]]:row-start-3',
                hasLeadingVisual
                  ? 'grid-cols-[auto_auto_minmax(0,1fr)] items-center [&>[data-component="FormControl.Caption"]]:col-start-3 [&>[data-component="FormControl.Label"]]:col-start-3 [&>[data-component="FormControl.Validation"]]:col-start-3'
                  : 'grid-cols-[auto_minmax(0,1fr)] items-start [&>[data-component="FormControl.Caption"]]:col-start-2 [&>[data-component="FormControl.Label"]]:col-start-2 [&>[data-component="FormControl.Validation"]]:col-start-2',
              )
            : 'flex flex-col items-start gap-1',
          className,
        )
  const context = React.useMemo(
    () => ({
      'aria-describedby': describedBy,
      'aria-invalid': hasErrorValidation || undefined,
      disabled: rest.disabled,
      id: controlId,
      name: rest.name,
      required,
    }),
    [controlId, describedBy, hasErrorValidation, required, rest.disabled, rest.name],
  )

  return (
    <FormControlLayoutContext.Provider value={layout}>
      <FormControlContextProvider value={context}>
        <Field.Root
          {...rest}
          ref={ref}
          data-component="FormControl"
          data-layout={layout}
          data-required={required || undefined}
          className={mergedClassName}
        >
          {children}
        </Field.Root>
      </FormControlContextProvider>
    </FormControlLayoutContext.Provider>
  )
})

export interface FormControlLabelProps extends Omit<Field.Label.Props, 'className' | 'data-component'> {
  className?: Field.Label.Props['className']
  visuallyHidden?: boolean
  requiredIndicator?: boolean
  requiredText?: string
}

function FormControlLabel(
  {
    children,
    className,
    htmlFor,
    requiredIndicator = true,
    requiredText,
    visuallyHidden,
    ...rest
  }: FormControlLabelProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const context = useFormControlContext()
  const layout = React.useContext(FormControlLayoutContext)
  const indicatorText = requiredText ?? (context?.required ? '*' : undefined)
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Label.State) =>
          cn(
            'block text-sm text-default data-[disabled]:text-muted',
            layout === 'horizontal' ? 'pl-2 font-normal' : 'font-semibold',
            visuallyHidden && 'sr-only',
            className(state),
          )
      : cn(
          'block text-sm text-default data-[disabled]:text-muted',
          layout === 'horizontal' ? 'pl-2 font-normal' : 'font-semibold',
          visuallyHidden && 'sr-only',
          className,
        )

  return (
    <Field.Label
      {...rest}
      ref={ref}
      htmlFor={htmlFor ?? context?.id}
      data-component="FormControl.Label"
      className={mergedClassName}
    >
      {indicatorText ? (
        <span className="flex gap-1">
          <span>{children}</span>
          <span aria-hidden={requiredIndicator ? undefined : true}>{indicatorText}</span>
        </span>
      ) : (
        children
      )}
    </Field.Label>
  )
}
const Label = React.forwardRef<HTMLElement, FormControlLabelProps>(FormControlLabel)

export interface FormControlCaptionProps extends Omit<Field.Description.Props, 'className' | 'data-component'> {
  className?: Field.Description.Props['className']
}
const Caption = React.forwardRef<HTMLParagraphElement, FormControlCaptionProps>(function Caption(
  {className, id, ...rest},
  ref,
) {
  const context = useFormControlContext()
  const layout = React.useContext(FormControlLayoutContext)
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Description.State) =>
          cn(
            'm-0 text-xs leading-[18px] text-muted data-[disabled]:text-disabled',
            layout === 'horizontal' && 'pl-2',
            className(state),
          )
      : cn(
          'm-0 text-xs leading-[18px] text-muted data-[disabled]:text-disabled',
          layout === 'horizontal' && 'pl-2',
          className,
        )

  return (
    <Field.Description
      {...rest}
      ref={ref}
      id={id ?? (context?.id ? `${context.id}-caption` : undefined)}
      data-component="FormControl.Caption"
      className={mergedClassName}
    />
  )
})

export interface FormControlValidationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'data-component'> {
  className?: string
  variant: 'error' | 'success'
}
const Validation = React.forwardRef<HTMLDivElement, FormControlValidationProps>(function Validation(
  {children, className, id, variant, ...rest},
  ref,
) {
  const context = useFormControlContext()
  const validationClassName = ValidationMessage.getClassName(variant, className)
  const validationId = id ?? (context?.id ? `${context.id}-validation` : undefined)
  const content = <ValidationMessage variant={variant}>{children}</ValidationMessage>

  if (variant === 'success') {
    return (
      <div
        {...rest}
        ref={ref}
        id={validationId}
        role="status"
        data-component="FormControl.Validation"
        data-variant={variant}
        className={validationClassName}
      >
        {content}
      </div>
    )
  }

  return (
    <Field.Error
      {...rest}
      ref={ref}
      id={validationId}
      match
      data-component="FormControl.Validation"
      data-variant={variant}
      className={validationClassName}
    >
      {content}
    </Field.Error>
  )
})

export type FormControlLeadingVisualProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'data-component'>
const LeadingVisual = React.forwardRef<HTMLDivElement, FormControlLeadingVisualProps>(function LeadingVisual(
  {className, ...rest},
  ref,
) {
  const context = useFormControlContext()

  return (
    <div
      {...rest}
      ref={ref}
      data-component="FormControl.LeadingVisual"
      data-control-disabled={context?.disabled || undefined}
      className={cn(
        'ml-2 flex shrink-0 items-center leading-none',
        context?.disabled ? 'text-disabled' : 'text-muted',
        className,
      )}
    />
  )
})

export type FormControlControlProps = Omit<Field.Control.Props, 'data-component'>
const Control = React.forwardRef<HTMLElement, FormControlControlProps>(function Control(props, ref) {
  return (
    <Field.Control
      {...props}
      ref={ref}
      data-component="FormControl.Control"
      className={cn(
        'm-0 h-8 appearance-none rounded-md border border-[var(--control-borderColor-rest)] bg-default px-3 text-sm leading-5 text-default shadow-[var(--shadow-inset)] outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:border-[var(--control-borderColor-disabled)] disabled:bg-[var(--control-bgColor-disabled)] disabled:text-disabled disabled:shadow-none focus:border-accent-emphasis focus:outline-2 focus:outline-offset-[-1px] focus:outline-focus aria-invalid:border-danger-emphasis aria-invalid:focus:border-[var(--control-borderColor-danger)] aria-invalid:focus:outline-[var(--control-borderColor-danger)]',
        props.className,
      )}
    />
  )
})

/**
 * A Field.Root config component with composable label, caption, validation, and visual pieces.
 * Compose its children in the needed semantic order; no consumer children are extracted or moved.
 */
export const FormControl = Object.assign(Root, {Label, Caption, Validation, LeadingVisual, Control})
;('use client')
