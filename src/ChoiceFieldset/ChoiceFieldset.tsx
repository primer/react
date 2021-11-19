import React, {ComponentProps} from 'react'
import {Box} from '..'
import createSlots from '../utils/create-slots'
import {uniqueId} from '../utils/uniqueId'
import ChoiceField from './ChoiceField'
import ChoiceFieldsetCaption from './ChoiceFieldsetCaption'
import ChoiceFieldsetLegend from './ChoiceFieldsetLegend'
import ChoiceFieldsetList from './ChoiceFieldsetList'
import ChoiceFieldsetValidation from './ChoiceFieldsetValidation'

export interface ChoiceFieldsetProps {
  /**
   * The unique identifier for this fieldset. Used to associate the validation text and caption text with the fieldset
   */
  id?: string
  // TODO: if `name` is not passed, generate one with `uniqueId()`
  /**
   * The unique identifier used to associate the inputs with eachother
   */
  name?: string
  // TODO: consider changing `onChange` to `onSelect`
  /**
   * The callback that is called when a user toggles a choice on or off
   */
  onChange?: (selectedValues?: string[]) => void
  /**
   * Whether this field must have a value for the user to complete their task
   */
  required?: boolean
}

export interface ChoiceFieldsetContext extends ChoiceFieldsetProps {
  captionId: string
  validationMessageId: string
}

const {Slots, Slot} = createSlots(['Caption', 'ChoiceList', 'Legend', 'Validation'])
export {Slot}

const ChoiceFieldset: React.FC<ChoiceFieldsetProps> = ({children, id, name, onChange, required}) => {
  const fieldsetId = id || uniqueId()
  const hasValidationChild = React.Children.toArray(children).some(
    child => React.isValidElement(child) && child.type === ChoiceFieldsetValidation
  )
  const captionId = `${fieldsetId}-caption`
  const validationMessageId = hasValidationChild ? `${fieldsetId}-validationMsg` : undefined

  return (
    <Slots
      context={{
        captionId,
        name,
        onChange,
        required,
        validationMessageId
      }}
    >
      {slots => {
        return (
          <div>
            <Box
              as="fieldset"
              border="none"
              margin={0}
              padding={0}
              aria-describedby={[validationMessageId, captionId].filter(Boolean).join(' ')}
            >
              {children}
              {slots.Legend}
              {slots.ChoiceList}
            </Box>
            {(slots.Validation || slots.Caption) && (
              <Box mt={3}>
                {slots.Validation}
                <Box mt={1}>{slots.Caption}</Box>
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
export type {ChoiceFieldProps} from './ChoiceField'
export default Object.assign(ChoiceFieldset, {
  ChoiceField,
  Caption: ChoiceFieldsetCaption,
  Legend: ChoiceFieldsetLegend,
  List: ChoiceFieldsetList,
  Validation: ChoiceFieldsetValidation
})
