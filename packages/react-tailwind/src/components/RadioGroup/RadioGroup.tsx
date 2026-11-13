'use client'

import {Fieldset} from '@base-ui/react/fieldset'
import {RadioGroup as BaseRadioGroup} from '@base-ui/react/radio-group'
import {useRender} from '@base-ui/react/use-render'
import React from 'react'
import {ChoiceGroupContext, useChoiceGroup} from '../../internal/choiceGroupContext'
import {ChoiceGroupCaption, ChoiceGroupLabel, ChoiceGroupValidation} from '../../internal/ChoiceGroupParts'
import {mergeClassName} from '../../internal/mergeClassName'
import {RadioGroupDisabledContext} from './RadioGroupDisabledContext'

export interface RadioGroupProps<Value = string>
  extends Omit<BaseRadioGroup.Props<Value>, 'className' | 'data-component'> {
  className?: BaseRadioGroup.Props<Value>['className']
}

export interface RadioGroupLabelProps extends Omit<Fieldset.Legend.Props, 'className' | 'data-component'> {
  className?: Fieldset.Legend.Props['className']
  /** Hides the label visually while keeping it available to assistive technology. */
  visuallyHidden?: boolean
}

/** Names the group. It is muted while the group is disabled. */
const Label = React.forwardRef<HTMLDivElement, RadioGroupLabelProps>(function Label(props, ref) {
  return <ChoiceGroupLabel {...props} ref={ref} component="RadioGroup" />
})

export type RadioGroupCaptionProps = React.HTMLAttributes<HTMLDivElement>

/** Describes the group with supporting text. */
const Caption = React.forwardRef<HTMLDivElement, RadioGroupCaptionProps>(function Caption(props, ref) {
  return <ChoiceGroupCaption {...props} ref={ref} component="RadioGroup" />
})

export interface RadioGroupValidationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the message reports a problem or confirms success. */
  variant: 'error' | 'success'
}

/** Describes the group with a validation message. */
const Validation = React.forwardRef<HTMLDivElement, RadioGroupValidationProps>(function Validation(props, ref) {
  return <ChoiceGroupValidation {...props} ref={ref} component="RadioGroup" />
})

/** Groups Radio primitives and implements roving keyboard focus. */
const Root = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    'aria-describedby': describedByProp,
    'aria-labelledby': labelledByProp,
    children,
    className,
    disabled = false,
    id,
    render,
    required = false,
    ...rest
  },
  ref,
) {
  const group = useChoiceGroup({
    'aria-describedby': describedByProp,
    children,
    // Base UI announces the requirement with `aria-required` on the radiogroup.
    describeRequired: false,
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
            <BaseRadioGroup
              {...rest}
              // Without a group label, Base UI falls back to an enclosing FormControl's label.
              {...(labelledBy ? {'aria-labelledby': labelledBy} : {})}
              ref={ref}
              id={id}
              aria-describedby={group.describedBy}
              disabled={fieldsetState.disabled}
              required={required}
              data-component="RadioGroup"
              className={mergeClassName('primer:m-0 primer:grid primer:min-w-0 primer:gap-2', className)}
              // Base UI resolves `disabled` from the group, an enclosing FormControl (Field), and Fieldset.
              render={(props, state) => (
                <RadioGroupDisabledContext.Provider value={state.disabled}>
                  <RadioGroupElement {...props} render={render} state={state} />
                </RadioGroupDisabledContext.Provider>
              )}
            >
              {children}
            </BaseRadioGroup>
          )
        }}
      />
    </ChoiceGroupContext.Provider>
  )
})

interface RadioGroupElementProps extends React.HTMLAttributes<HTMLDivElement> {
  render: RadioGroupProps['render']
  state: BaseRadioGroup.State
}

/** Renders the group element while still honoring a consumer's `render` prop. */
const RadioGroupElement = React.forwardRef<HTMLDivElement, RadioGroupElementProps>(function RadioGroupElement(
  {render, state, ...props},
  ref,
) {
  return useRender<Record<string, unknown>, HTMLDivElement>({
    render: typeof render === 'function' ? elementProps => render(elementProps, state) : render,
    props,
    ref,
  })
})

export const RadioGroup = Object.assign(Root, {Label, Caption, Validation})

RadioGroup.displayName = 'RadioGroup'
