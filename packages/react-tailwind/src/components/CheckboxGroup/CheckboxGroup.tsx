'use client'

import {CheckboxGroup as BaseCheckboxGroup} from '@base-ui/react/checkbox-group'
import {Fieldset} from '@base-ui/react/fieldset'
import React from 'react'
import {ChoiceGroupContext, useChoiceGroup} from '../../internal/choiceGroupContext'
import {ChoiceGroupCaption, ChoiceGroupLabel, ChoiceGroupValidation} from '../../internal/ChoiceGroupParts'
import {mergeClassName} from '../../internal/mergeClassName'

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, 'className' | 'data-component'> {
  className?: BaseCheckboxGroup.Props['className']
  /** Marks a choice as required: the label shows a required marker and the group is described as required. */
  required?: boolean
}

export interface CheckboxGroupLabelProps extends Omit<Fieldset.Legend.Props, 'className' | 'data-component'> {
  className?: Fieldset.Legend.Props['className']
  /** Hides the label visually while keeping it available to assistive technology. */
  visuallyHidden?: boolean
}

/** Names the group. It is muted while the group is disabled. */
const Label = React.forwardRef<HTMLDivElement, CheckboxGroupLabelProps>(function Label(props, ref) {
  return <ChoiceGroupLabel {...props} ref={ref} component="CheckboxGroup" />
})

export type CheckboxGroupCaptionProps = React.HTMLAttributes<HTMLDivElement>

/** Describes the group with supporting text. */
const Caption = React.forwardRef<HTMLDivElement, CheckboxGroupCaptionProps>(function Caption(props, ref) {
  return <ChoiceGroupCaption {...props} ref={ref} component="CheckboxGroup" />
})

export interface CheckboxGroupValidationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the message reports a problem or confirms success. */
  variant: 'error' | 'success'
}

/** Describes the group with a validation message. */
const Validation = React.forwardRef<HTMLDivElement, CheckboxGroupValidationProps>(function Validation(props, ref) {
  return <ChoiceGroupValidation {...props} ref={ref} component="CheckboxGroup" />
})

/** Groups checkbox primitives and supplies controlled or uncontrolled values. */
const Root = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  {
    'aria-describedby': describedByProp,
    'aria-labelledby': labelledByProp,
    children,
    className,
    disabled = false,
    id,
    required = false,
    ...rest
  },
  ref,
) {
  const group = useChoiceGroup({
    'aria-describedby': describedByProp,
    children,
    // `role="group"` does not support `aria-required`, so the requirement is announced as a description.
    describeRequired: true,
    disabled,
    id,
    parts: {label: Label, caption: Caption, validation: Validation},
    required,
  })

  return (
    <ChoiceGroupContext.Provider value={group.context}>
      {/* Fieldset names the group from its Label and disables every nested FormControl with it. */}
      <Fieldset.Root
        disabled={disabled}
        render={(fieldsetProps, fieldsetState) => {
          const labelledBy = labelledByProp ?? group.labelId ?? fieldsetProps['aria-labelledby']

          return (
            <BaseCheckboxGroup
              {...rest}
              // Without a group label, Base UI falls back to an enclosing FormControl's label.
              {...(labelledBy ? {'aria-labelledby': labelledBy} : {})}
              ref={ref}
              id={id}
              aria-describedby={group.describedBy}
              disabled={fieldsetState.disabled}
              data-component="CheckboxGroup"
              className={mergeClassName('m-0 grid min-w-0 gap-2', className)}
            >
              {children}
              {group.requiredId ? (
                <span id={group.requiredId} className="sr-only">
                  Required
                </span>
              ) : null}
            </BaseCheckboxGroup>
          )
        }}
      />
    </ChoiceGroupContext.Provider>
  )
})

export const CheckboxGroup = Object.assign(Root, {Label, Caption, Validation})

CheckboxGroup.displayName = 'CheckboxGroup'
