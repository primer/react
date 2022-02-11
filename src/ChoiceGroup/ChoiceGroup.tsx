import React, {ComponentProps} from 'react'
import {Box, Checkbox, FormControl, Radio, useSSRSafeId} from '..' // Checkbox, FormControl, Radio,
import ValidationAnimationContainer from '../_ValidationAnimationContainer'
import ChoiceGroupCaption from './_ChoiceGroupCaption'
import ChoiceGroupLabel from './_ChoiceGroupLabel'
import ChoiceGroupValidation from './_ChoiceGroupValidation'
import {Slots} from './slots'
import styled from 'styled-components'
import {get} from '../constants'
import {expectedInputComponents} from '../expectedInputComponents'
import ChoiceGroupContext from './_ChoiceGroupContext'
import VisuallyHidden from '../_VisuallyHidden'
import {SxProp} from '../sx'

export type ChoiceGroupProps = {
  /**
   * Used when associating the input group with a label other than `ChoiceGroup.Label`
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
   * Whether this field must have a value for the user to complete their task
   */
  required?: boolean
} & SxProp

export type ChoiceGroupContext = {
  validationMessageId?: string
  captionId?: string
} & ChoiceGroupProps

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

const ChoiceGroup: React.FC<ChoiceGroupProps> = ({
  'aria-labelledby': ariaLabelledby,
  children,
  disabled,
  id: idProp,
  required,
  sx
}) => {
  const labelChild = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === ChoiceGroupLabel
  )
  const validationChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) && child.type === ChoiceGroupValidation ? child : null
  )
  const captionChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) && child.type === ChoiceGroupCaption ? child : null
  )
  const id = useSSRSafeId(idProp)
  const validationMessageId = validationChild && `${id}-validationMessage`
  const captionId = captionChild && `${id}-caption`
  const checkIfOnlyContainsChoiceInputs = () => {
    const formControlComponentChildren = React.Children.toArray(children)
      .filter(child => React.isValidElement(child) && child.type === FormControl)
      .map(formControlComponent =>
        React.isValidElement(formControlComponent) ? formControlComponent.props.children : []
      )
      .flat()

    return React.Children.toArray(formControlComponentChildren)
      .filter(child =>
        expectedInputComponents.some(inputComponent => React.isValidElement(child) && child.type === inputComponent)
      )
      .every(
        inputComponent =>
          React.isValidElement(inputComponent) && (inputComponent.type === Checkbox || inputComponent.type === Radio)
      )
  }

  if (!checkIfOnlyContainsChoiceInputs()) {
    // eslint-disable-next-line no-console
    console.warn('Only `Checkbox` and `Radio` form controls should be used in a `ChoiceGroup`.')
  }

  if (!labelChild && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'A choice group must be labelled using a `ChoiceGroup.Label` child, or by passing `aria-labelledby` to the ChoiceGroup component.'
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
        const isLegendVisible = React.isValidElement(labelChild) && labelChild.props.isVisible

        return (
          <ChoiceGroupContext.Provider value={{disabled}}>
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
                    <VisuallyHidden>{slots.Validation}</VisuallyHidden>
                  </Box>
                ) : (
                  /*
                    If ChoiceGroup.Label wasn't passed as a child, we don't render a <legend> 
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
                  // If we have ChoiceGroup.Label as a child, we render a screenreader-accessible validation message in the <legend>
                  aria-hidden={Boolean(labelChild)}
                  show
                >
                  {slots.Validation}
                </ValidationAnimationContainer>
              )}
            </div>
          </ChoiceGroupContext.Provider>
        )
      }}
    </Slots>
  )
}

export type InputFieldComponentProps = ComponentProps<typeof ChoiceGroup>
export type {ChoiceGroupLabelProps} from './_ChoiceGroupLabel'
export default Object.assign(ChoiceGroup, {
  Caption: ChoiceGroupCaption,
  Label: ChoiceGroupLabel,
  Validation: ChoiceGroupValidation
})
