import React from 'react'
import {Box, useSSRSafeId} from '..'
import ValidationAnimationContainer from '../_ValidationAnimationContainer'
import CheckboxOrRadioGroupCaption from './_CheckboxOrRadioGroupCaption'
import CheckboxOrRadioGroupLabel from './_CheckboxOrRadioGroupLabel'
import CheckboxOrRadioGroupValidation from './_CheckboxOrRadioGroupValidation'
import {Slots} from './slots'
import styled from 'styled-components'
import {get} from '../constants'
import CheckboxOrRadioGroupContext from './_CheckboxOrRadioGroupContext'
import VisuallyHidden from '../_VisuallyHidden'
import {SxProp} from '../sx'

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

export type CheckboxOrRadioGroupContext = {
  validationMessageId?: string
  captionId?: string
} & CheckboxOrRadioGroupProps

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
  disabled,
  id: idProp,
  required,
  sx
}) => {
  const labelChild = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === CheckboxOrRadioGroupLabel
  )
  const validationChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) && child.type === CheckboxOrRadioGroupValidation ? child : null
  )
  const captionChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) && child.type === CheckboxOrRadioGroupCaption ? child : null
  )
  const id = useSSRSafeId(idProp)
  const validationMessageId = validationChild && `${id}-validationMessage`
  const captionId = captionChild && `${id}-caption`

  if (!labelChild && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'A choice group must be labelled using a `CheckboxOrRadioGroup.Label` child, or by passing `aria-labelledby` to the CheckboxOrRadioGroup component.'
    )
  }

  return (
    <Slots
      context={{
        disabled,
        required,
        captionId,
        validationMessageId
      }}
    >
      {slots => {
        const isLegendVisible = React.isValidElement(labelChild) && !labelChild.props.visuallyHidden

        return (
          <CheckboxOrRadioGroupContext.Provider value={{disabled}}>
            <div>
              <Box
                border="none"
                margin={0}
                mb={validationChild ? 2 : undefined}
                padding={0}
                {...(labelChild && {
                  as: 'fieldset',
                  disabled
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
                    {slots.Label}
                    {slots.Caption}
                    {React.isValidElement(slots.Validation) && slots.Validation.props.children && (
                      <VisuallyHidden>{slots.Validation.props.children}</VisuallyHidden>
                    )}
                  </Box>
                ) : (
                  /*
                    If CheckboxOrRadioGroup.Label wasn't passed as a child, we don't render a <legend> 
                    but we still want to render a caption
                  */
                  slots.Caption
                )}

                <Body
                  {...(!labelChild && {
                    ['aria-labelledby']: ariaLabelledby,
                    ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
                    as: 'div',
                    role: 'group'
                  })}
                >
                  {React.Children.toArray(children).filter(child => React.isValidElement(child))}
                </Body>
              </Box>
              {validationChild && (
                <ValidationAnimationContainer
                  // If we have CheckboxOrRadioGroup.Label as a child, we render a screenreader-accessible validation message in the <legend>
                  aria-hidden={Boolean(labelChild)}
                  show
                >
                  {slots.Validation}
                </ValidationAnimationContainer>
              )}
            </div>
          </CheckboxOrRadioGroupContext.Provider>
        )
      }}
    </Slots>
  )
}

CheckboxOrRadioGroup.defaultProps = {
  disabled: false,
  required: false
}

export type {CheckboxOrRadioGroupLabelProps} from './_CheckboxOrRadioGroupLabel'
export default Object.assign(CheckboxOrRadioGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
})
