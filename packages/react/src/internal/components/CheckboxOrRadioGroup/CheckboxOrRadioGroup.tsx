import React from 'react'
import ValidationAnimationContainer from '../ValidationAnimationContainer'
import {useId} from '../../../hooks/useId'
import CheckboxOrRadioGroupCaption from './CheckboxOrRadioGroupCaption'
import CheckboxOrRadioGroupLabel from './CheckboxOrRadioGroupLabel'
import CheckboxOrRadioGroupValidation from './CheckboxOrRadioGroupValidation'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'
import VisuallyHidden from '../../../_VisuallyHidden'
import {useSlots} from '../../../hooks/useSlots'
import classes from './CheckboxOrRadioGroup.module.css'
import {clsx} from 'clsx'
import {isSlot} from '../../../utils/is-slot'

export type CheckboxOrRadioGroupProps = {
  /** Class name for custom styling */
  className?: string
  /**
   * Used when associating the input group with a label other than `CheckboxOrRadioGroup.Label`
   */
  ['aria-labelledby']?: string
  /**
   * Whether the input group allows user input
   */
  disabled?: boolean
  /**
   * The unique identifier for this input group. Used to associate the label, validation text, and caption text.
   * You may want a custom ID to make it easier to select elements in integration tests.
   */
  id?: string
  /**
   * If true, the user must make a selection before the owning form can be submitted
   */
  required?: boolean
}

const CheckboxOrRadioGroup: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupProps>> = ({
  'aria-labelledby': ariaLabelledby,
  children,
  disabled = false,
  id: idProp,
  required = false,
  className,
}) => {
  const [slots, rest] = useSlots(children, {
    caption: CheckboxOrRadioGroupCaption,
    label: CheckboxOrRadioGroupLabel,
    validation: CheckboxOrRadioGroupValidation,
  })
  const labelChild = React.Children.toArray(children).find(
    child =>
      React.isValidElement(child) &&
      (child.type === CheckboxOrRadioGroupLabel || isSlot(child, CheckboxOrRadioGroupLabel)),
  )
  const validationChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) &&
    (child.type === CheckboxOrRadioGroupValidation || isSlot(child, CheckboxOrRadioGroupValidation))
      ? child
      : null,
  )
  const captionChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) &&
    (child.type === CheckboxOrRadioGroupCaption || isSlot(child, CheckboxOrRadioGroupCaption))
      ? child
      : null,
  )
  const id = useId(idProp)
  const validationMessageId = validationChild ? `${id}-validationMessage` : undefined
  const captionId = captionChild ? `${id}-caption` : undefined

  if (!labelChild && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'A choice group must be labelled using a `CheckboxOrRadioGroup.Label` child, or by passing `aria-labelledby` to the CheckboxOrRadioGroup component.',
    )
  }

  const isLegendVisible = React.isValidElement(labelChild) && !labelChild.props.visuallyHidden

  const Component = labelChild ? 'fieldset' : 'div'

  return (
    <CheckboxOrRadioGroupContext.Provider
      value={{
        disabled,
        required,
        captionId,
        validationMessageId,
      }}
    >
      <div>
        <Component
          {...(labelChild
            ? {
                disabled,
              }
            : {})}
          className={clsx(className, classes.GroupFieldset)}
          data-validation={validationChild ? '' : undefined}
        >
          {labelChild ? (
            /*
                  Placing the caption text and validation text in the <legend> provides a better user
                  experience for more screenreaders.

                  Reference: https://blog.tenon.io/accessible-validation-of-checkbox-and-radiobutton-groups/
                */
            <legend className={classes.GroupLegend} data-legend-visible={isLegendVisible ? '' : undefined}>
              {slots.label}
              {slots.caption}
              {React.isValidElement(slots.validation) && slots.validation.props.children && (
                <VisuallyHidden>{slots.validation.props.children}</VisuallyHidden>
              )}
            </legend>
          ) : (
            /*
                  If CheckboxOrRadioGroup.Label wasn't passed as a child, we don't render a <legend>
                  but we still want to render a caption
                */
            slots.caption
          )}

          <div
            {...(!labelChild
              ? {
                  ['aria-labelledby']: ariaLabelledby,
                  ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
                  as: 'div',
                  role: 'group',
                }
              : {})}
            className={classes.Body}
          >
            {React.Children.toArray(rest).filter(child => React.isValidElement(child))}
          </div>
        </Component>
        {validationChild && (
          <ValidationAnimationContainer
            // If we have CheckboxOrRadioGroup.Label as a child, we render a screenreader-accessible validation message in the <legend>
            aria-hidden={Boolean(labelChild)}
            show
          >
            {slots.validation}
          </ValidationAnimationContainer>
        )}
      </div>
    </CheckboxOrRadioGroupContext.Provider>
  )
}

export type {CheckboxOrRadioGroupLabelProps} from './CheckboxOrRadioGroupLabel'
export default Object.assign(CheckboxOrRadioGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation,
})
