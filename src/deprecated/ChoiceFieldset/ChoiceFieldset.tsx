import React from 'react'
import {Box, useSSRSafeId} from '../..'
import createSlots from '../utils/create-slots'
import {FormValidationStatus} from '../../utils/types/FormValidationStatus'
import ValidationAnimationContainer from '../../internal/components/ValidationAnimationContainer'
import InputValidation from '../../internal/components/InputValidation'
import ChoiceFieldsetListItem from './ChoiceFieldsetListItem'
import ChoiceFieldsetDescription from './ChoiceFieldsetDescription'
import ChoiceFieldsetLegend from './ChoiceFieldsetLegend'
import ChoiceFieldsetList from './ChoiceFieldsetList'
import ChoiceFieldsetValidation from './ChoiceFieldsetValidation'

export interface ChoiceFieldsetProps<T = Record<string, FormValidationStatus>> {
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
   * The callback that is called when a user toggles a choice on or off
   */
  onSelect?: (selectedValues: string[]) => void
  /**
   * Whether this field must have a value for the user to complete their task
   */
  required?: boolean
  /**
   * The selected values
   */
  selected?: string[]
  /**
   * A map of validation statuses and their associated validation keys. When one of the validation keys is passed to the `validationResult` prop,
   * the associated validation message will be rendered in the correct style
   */
  validationMap?: T
  /**
   * The key of the validation message to show
   */
  validationResult?: keyof T
}

export interface ChoiceFieldsetContext extends ChoiceFieldsetProps {
  validationMessageId: string
}

const {Slots, Slot} = createSlots(['Description', 'ChoiceList', 'Legend', 'Validation'])
export {Slot}

const ChoiceFieldset = <T extends Record<string, FormValidationStatus>>({
  children,
  disabled,
  id,
  name,
  onSelect,
  required,
  selected,
  validationMap,
  validationResult,
}: ChoiceFieldsetProps<T>) => {
  const fieldsetId = useSSRSafeId(id)
  const validationChildren: React.ReactElement[] | undefined | null = React.Children.map(children, child =>
    React.isValidElement(child) && child.type === ChoiceFieldsetValidation ? child : null,
  )?.filter(Boolean)
  const validationChildToRender = validationChildren?.find(child => child.props.validationKey === validationResult)
  const validationMessageId = validationChildToRender ? `${fieldsetId}-validationMsg` : undefined

  return (
    <Slots
      context={{
        disabled,
        name,
        onSelect,
        required,
        selected,
        validationMessageId,
      }}
    >
      {slots => {
        const isLegendVisible = React.isValidElement(slots.Legend) && slots.Legend.props.isVisible

        return (
          <div>
            <Box
              as="fieldset"
              border="none"
              margin={0}
              padding={0}
              aria-describedby={[validationMessageId].filter(Boolean).join(' ')}
            >
              {React.Children.toArray(children).filter(
                child => React.isValidElement(child) && child.type !== ChoiceFieldsetValidation,
              )}
              <Box mb={isLegendVisible ? 3 : undefined}>
                {slots.Legend}
                {slots.Description}
              </Box>
              {slots.ChoiceList}
            </Box>
            {validationChildToRender && (
              <Box mt={3}>
                {validationMap && validationResult && validationMessageId && (
                  <ValidationAnimationContainer show>
                    <InputValidation validationStatus={validationMap[validationResult]} id={validationMessageId}>
                      {validationChildToRender}
                    </InputValidation>
                  </ValidationAnimationContainer>
                )}
              </Box>
            )}
          </div>
        )
      }}
    </Slots>
  )
}

export type {ChoiceFieldsetListProps} from './ChoiceFieldsetList'
export type {ChoiceFieldsetLegendProps} from './ChoiceFieldsetLegend'
export type {ChoiceFieldProps} from './ChoiceFieldsetListItem'
/**
 * @deprecated Use `CheckboxGroup` or `RadioGroup` instead. See https://primer.style/react/CheckboxGroup and https://primer.style/react/RadioGroup for more info
 */
export default Object.assign(ChoiceFieldset, {
  Description: ChoiceFieldsetDescription,
  Item: ChoiceFieldsetListItem,
  Legend: ChoiceFieldsetLegend,
  List: ChoiceFieldsetList,
  Validation: ChoiceFieldsetValidation,
})
