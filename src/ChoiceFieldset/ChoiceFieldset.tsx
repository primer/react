import React, {ComponentProps} from 'react'
import {Box} from '..'
import createSlots from '../utils/create-slots'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {uniqueId} from '../utils/uniqueId'
import ValidationAnimationContainer from '../_InputField/ValidationAnimationContainer'
import InputValidation from '../_InputValidation'
import ChoiceFieldsetListItem from './ChoiceFieldsetListItem'
import ChoiceFieldsetCaption from './ChoiceFieldsetCaption'
import ChoiceFieldsetLegend from './ChoiceFieldsetLegend'
import ChoiceFieldsetList from './ChoiceFieldsetList'
import ChoiceFieldsetValidation from './ChoiceFieldsetValidation'

export interface ChoiceFieldsetProps<T = Record<string, FormValidationStatus>> {
  children?: React.ReactNode
  /**
   * Whether the fieldset is ready for user input
   */
  disabled?: boolean
  /**
   * The unique identifier for this fieldset. Used to associate the validation text and caption text with the fieldset
   */
  id?: string
  /**
   * The unique identifier used to associate the inputs with eachother
   */
  name?: string
  /**
   * The callback that is called when a user toggles a choice on or off
   */
  onSelect?: (selectedValues?: string[]) => void
  /**
   * Whether this field must have a value for the user to complete their task
   */
  required?: boolean
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
  captionId: string
  validationMessageId: string
}

const {Slots, Slot} = createSlots(['Caption', 'ChoiceList', 'Legend', 'Validation'])
export {Slot}

const ChoiceFieldset = <T extends Record<string, FormValidationStatus>>({
  children,
  disabled,
  id,
  name,
  onSelect,
  required,
  validationMap,
  validationResult
}: ChoiceFieldsetProps<T>) => {
  const fieldsetId = id || uniqueId()
  const validationChildren: React.ReactElement[] | undefined | null = React.Children.map(children, child =>
    React.isValidElement(child) && child.type === ChoiceFieldsetValidation ? child : null
  )?.filter(Boolean)
  const validationChildToRender = validationChildren?.find(child => child.props.validationKey === validationResult)
  const captionId = `${fieldsetId}-caption`
  const validationMessageId = validationChildToRender ? `${fieldsetId}-validationMsg` : undefined

  return (
    <Slots
      context={{
        captionId,
        disabled,
        name,
        onSelect,
        required,
        validationMessageId
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
              aria-describedby={[validationMessageId, captionId].filter(Boolean).join(' ')}
            >
              {React.Children.toArray(children).filter(
                child => React.isValidElement(child) && child.type !== ChoiceFieldsetValidation
              )}
              <Box mb={isLegendVisible ? 3 : undefined}>{slots.Legend}</Box>
              {slots.ChoiceList}
            </Box>
            {(validationChildToRender || slots.Caption) && (
              <Box mt={3}>
                {validationChildToRender && validationMap && validationResult && validationMessageId && (
                  <ValidationAnimationContainer show>
                    <InputValidation validationStatus={validationMap[validationResult]} id={validationMessageId}>
                      {validationChildToRender}
                    </InputValidation>
                  </ValidationAnimationContainer>
                )}
                <Box mt={validationChildToRender ? 1 : undefined}>{slots.Caption}</Box>
              </Box>
            )}
          </div>
        )
      }}
    </Slots>
  )
}

export type InputFieldComponentProps = ComponentProps<typeof ChoiceFieldset>
export type {ChoiceFieldsetListProps} from './ChoiceFieldsetList'
export type {ChoiceFieldsetLegendProps} from './ChoiceFieldsetLegend'
export type {ChoiceFieldProps} from './ChoiceFieldsetListItem'
export default Object.assign(ChoiceFieldset, {
  Item: ChoiceFieldsetListItem,
  Caption: ChoiceFieldsetCaption,
  Legend: ChoiceFieldsetLegend,
  List: ChoiceFieldsetList,
  Validation: ChoiceFieldsetValidation
})
