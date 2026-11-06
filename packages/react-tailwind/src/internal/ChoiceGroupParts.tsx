'use client'

import {Fieldset} from '@base-ui/react/fieldset'
import React from 'react'
import {type ChoiceGroupComponent, useChoiceGroupContext, useRegisterChoiceGroupPart} from './choiceGroupContext'
import {cn} from './cn'
import {mergeClassName} from './mergeClassName'
import {ValidationMessage} from './ValidationMessage'

export interface ChoiceGroupLabelProps extends Omit<Fieldset.Legend.Props, 'className' | 'data-component'> {
  className?: Fieldset.Legend.Props['className']
  /** Hides the label visually while keeping it available to assistive technology. */
  visuallyHidden?: boolean
}

interface PartOf {
  component: ChoiceGroupComponent
}

/** The group's legend: Base UI names the group with it and mutes it while the group is disabled. */
export const ChoiceGroupLabel = React.forwardRef<HTMLDivElement, ChoiceGroupLabelProps & PartOf>(
  function ChoiceGroupLabel({children, className, component, id, visuallyHidden, ...rest}, ref) {
    const context = useChoiceGroupContext()

    return (
      <Fieldset.Legend
        {...rest}
        ref={ref}
        id={id ?? context?.labelId}
        data-component={`${component}.Label`}
        className={mergeClassName(
          cn('block text-sm font-semibold text-default data-[disabled]:text-muted', visuallyHidden && 'sr-only'),
          className,
        )}
      >
        {context?.required ? (
          <span className="flex gap-2">
            <span>{children}</span>
            {/* The group announces `required` itself, so the marker is visual only. */}
            <span aria-hidden="true">*</span>
          </span>
        ) : (
          children
        )}
      </Fieldset.Legend>
    )
  },
)

export type ChoiceGroupCaptionProps = React.HTMLAttributes<HTMLDivElement>

export const ChoiceGroupCaption = React.forwardRef<HTMLDivElement, ChoiceGroupCaptionProps & PartOf>(
  function ChoiceGroupCaption({children, className, component, id, ...rest}, ref) {
    const context = useChoiceGroupContext()
    const captionId = id ?? context?.captionId
    useRegisterChoiceGroupPart('caption', captionId)

    return (
      <div
        {...rest}
        ref={ref}
        id={captionId}
        data-component={`${component}.Caption`}
        // Upstream renders the caption inside the legend, directly under a visible label.
        className={cn('text-muted [[data-component$=Label]:not(.sr-only)+&]:-mt-2', className)}
      >
        {/* An inline run sits in the surrounding font's line box, which places the text like upstream's caption. */}
        <span className="text-sm">{children}</span>
      </div>
    )
  },
)

export interface ChoiceGroupValidationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the message reports a problem or confirms success. */
  variant: 'error' | 'success'
}

export const ChoiceGroupValidation = React.forwardRef<HTMLDivElement, ChoiceGroupValidationProps & PartOf>(
  function ChoiceGroupValidation({children, className, component, id, variant, ...rest}, ref) {
    const context = useChoiceGroupContext()
    const validationId = id ?? context?.validationId
    useRegisterChoiceGroupPart('validation', validationId)

    return (
      <div
        {...rest}
        ref={ref}
        id={validationId}
        role={variant === 'success' ? 'status' : 'alert'}
        data-component={`${component}.Validation`}
        data-variant={variant}
        className={ValidationMessage.getClassName(variant, className)}
      >
        <ValidationMessage variant={variant}>{children}</ValidationMessage>
      </div>
    )
  },
)
