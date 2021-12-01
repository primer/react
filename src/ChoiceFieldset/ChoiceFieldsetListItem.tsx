import React, {useContext} from 'react'
import {ComponentProps} from '../utils/types'
import {uniqueId} from '../utils/uniqueId'
import ToggleInputLeadingVisual from '../_InputField/ToggleInputLeadingVisual'
import ChoiceFieldCaption from './ChoiceFieldCaption'
import ChoiceFieldLabel from './ChoiceFieldLabel'
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext'

export interface ChoiceFieldProps {
  /**
   * Whether the field is ready for user input
   */
  disabled?: boolean
  /**
   * The unique identifier for this field. Used to associate the label, validation text, and caption text
   */
  id?: string
  /**
   * The value that is being selected
   */
  value: string
}

const ChoiceFieldsetListItem: React.FC<ChoiceFieldProps> = ({children, id, disabled: disabledProp, value}) => {
  const choiceFieldsetListContext = useContext(ChoiceFieldsetListContext)
  if (choiceFieldsetListContext === null) {
    throw new Error('ChoiceFieldsetListContext returned null')
  }
  const {name, onChange, fieldComponent: FieldComponent, selected, disabled} = choiceFieldsetListContext

  const fieldId = id || uniqueId()

  return (
    <FieldComponent id={fieldId} disabled={disabledProp || disabled}>
      <FieldComponent.Input checked={selected?.includes(value)} value={value} name={name} onChange={onChange} />
      {children}
    </FieldComponent>
  )
}

export type ChoiceFieldComponentProps = ComponentProps<typeof ChoiceFieldsetListItem>
export default Object.assign(ChoiceFieldsetListItem, {
  Caption: ChoiceFieldCaption,
  Label: ChoiceFieldLabel,
  LeadingVisual: ToggleInputLeadingVisual
})
