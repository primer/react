import React, {ComponentProps} from 'react'
import {Box, Checkbox, FormControl, Radio, useSSRSafeId} from '..'
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

export type ChoiceGroupProps = {
  /**
   * Used when associating the choice group with a label other than `ChoiceGroup.Label`
   */
  ['aria-labelledby']?: string
  children?: React.ReactNode
  /**
   * Whether the fieldset is NOT ready for user input
   */
  disabled?: boolean
  /**
   * The unique identifier for this fieldset. Used to associate the validation text with the fieldset
   * If an ID is not passed, one will be automatically generated
   */
  id?: string
  /**
   * The unique identifier used to associate radio inputs with eachother
   * If a name is not passed and the fieldset renders radio inputs, a name will be automatically generated
   */
  name?: string
  /**
   * TODO: consider removing this
   * The callback that is called when a user toggles a choice on or off
   */
  onSelect?: (selectedValues: string[]) => void
  /**
   * Whether this field must have a value for the user to complete their task
   */
  required?: boolean
  /**
   * TODO: if we remove onSelect, also remove this
   * The selected values
   */
  selected?: string[]
}

export type ChoiceGroupContext = {
  validationMessageId: string
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

const ChoiceGroup = ({
  'aria-labelledby': ariaLabelledby,
  children,
  disabled,
  id,
  name,
  onSelect,
  required,
  selected
}: ChoiceGroupProps) => {
  const fieldsetId = useSSRSafeId(id)
  const validationChild = React.Children.toArray(children).find(child =>
    React.isValidElement(child) && child.type === ChoiceGroupValidation ? child : null
  )
  const validationMessageId = validationChild ? `${fieldsetId}-validationMsg` : ''
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

  return (
    <Slots
      context={{
        disabled,
        name,
        onSelect,
        required,
        selected,
        validationMessageId
      }}
    >
      {slots => {
        const isLegendVisible = React.isValidElement(slots.Label) && slots.Label.props.isVisible
        const hasLegendContent = slots.Label || slots.Caption || slots.Validation

        if (!slots.Label || !ariaLabelledby) {
          // eslint-disable-next-line no-console
          console.warn(
            'A choice group must be labelled using a `ChoiceGroup.Label` child, or by passing `aria-labelledby` to the ChoiceGroup component.'
          )
        }

        return (
          <ChoiceGroupContext.Provider value={{disabled}}>
            <div>
              <Box
                border="none"
                margin={0}
                mb={validationChild ? 2 : undefined}
                padding={0}
                {...(hasLegendContent
                  ? {
                      as: 'fieldset',
                      disabled
                    }
                  : {
                      ['aria-describedby']: validationMessageId,
                      as: 'div',
                      role: 'group'
                    })}
              >
                {hasLegendContent && (
                  /*
                    Placing the caption text and validation text in the <legend> provides a better user experience for more screenreaders
                    Reference: https://blog.tenon.io/accessible-validation-of-checkbox-and-radiobutton-groups/
                  */
                  <Box as="legend" mb={isLegendVisible ? 2 : undefined} padding={0}>
                    {slots.Label}
                    {slots.Caption}
                    <VisuallyHidden>{slots.Validation}</VisuallyHidden>
                  </Box>
                )}

                <Body>{React.Children.toArray(children).filter(child => React.isValidElement(child))}</Body>
              </Box>
              {validationChild && (
                <ValidationAnimationContainer aria-hidden="true" show>
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
