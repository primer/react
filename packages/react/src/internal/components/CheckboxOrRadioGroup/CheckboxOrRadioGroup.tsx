import React from 'react'
import styled from 'styled-components'
import Box from '../../../Box'
import ValidationAnimationContainer from '../ValidationAnimationContainer'
import {get} from '../../../constants'
import {useId} from '../../../hooks/useId'
import CheckboxOrRadioGroupCaption from './CheckboxOrRadioGroupCaption'
import CheckboxOrRadioGroupLabel from './CheckboxOrRadioGroupLabel'
import CheckboxOrRadioGroupValidation from './CheckboxOrRadioGroupValidation'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'
import VisuallyHidden from '../../../_VisuallyHidden'
import {useSlots} from '../../../hooks/useSlots'
import type {SxProp} from '../../../sx'

export type CheckboxOrRadioGroupProps = {
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
} & SxProp

const Body = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;

  > * + * {
    margin-top: ${get('space.2')};
  }
`

const CheckboxOrRadioGroup: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupProps>> = ({
  'aria-labelledby': ariaLabelledby,
  children,
  disabled = false,
  id: idProp,
  required = false,
  sx,
}) => {
  const [slots, rest] = useSlots(children, {
    caption: CheckboxOrRadioGroupCaption,
    label: CheckboxOrRadioGroupLabel,
    validation: CheckboxOrRadioGroupValidation,
  })
  const labelChild = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === CheckboxOrRadioGroupLabel,
  )
  const validationChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) && child.type === CheckboxOrRadioGroupValidation ? child : null,
  )
  const captionChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) && child.type === CheckboxOrRadioGroupCaption ? child : null,
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
        <Box
          border="none"
          margin={0}
          mb={validationChild ? 2 : undefined}
          padding={0}
          {...(labelChild && {
            as: 'fieldset',
            disabled,
          })}
          sx={sx}
        >
          {labelChild ? (
            /*
              Placing the caption text and validation text in the <legend> provides a better user
              experience for more screenreaders.

              Reference: https://blog.tenon.io/accessible-validation-of-checkbox-and-radiobutton-groups/
            */
            <Box as="legend" mb={isLegendVisible ? 2 : undefined} padding={0}>
              {slots.label}
              {slots.caption}
              {React.isValidElement(slots.validation) && slots.validation.props.children && (
                <VisuallyHidden>{slots.validation.props.children}</VisuallyHidden>
              )}
            </Box>
          ) : (
            /*
              If CheckboxOrRadioGroup.Label wasn't passed as a child, we don't render a <legend>
              but we still want to render a caption
            */
            slots.caption
          )}

          <Body
            {...(!labelChild && {
              ['aria-labelledby']: ariaLabelledby,
              ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
              as: 'div',
              role: 'group',
            })}
          >
            {React.Children.toArray(rest).filter(child => React.isValidElement(child))}
          </Body>
        </Box>
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
