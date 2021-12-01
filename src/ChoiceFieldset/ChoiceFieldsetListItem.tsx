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
   * The unique identifier for this field. Used to associate the label, validation text, and caption text.
   * If an ID is not provided, one will be automatically generated.
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
  const labelChild = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === ChoiceFieldLabel
  )
  const otherValidChildren = React.Children.toArray(children).filter(
    child =>
      React.isValidElement(child) && (child.type === ChoiceFieldCaption || child.type === ToggleInputLeadingVisual)
  )

  return (
    <FieldComponent id={fieldId} disabled={disabledProp || disabled}>
      <FieldComponent.Input checked={selected?.includes(value)} value={value} name={name} onChange={onChange} />
      {/* this ternary makes it possible for users to safely pass the label content directly as a child */}
      {labelChild ? (
        // if <Item.Label> was passed, we can just render the children as-is
        children
      ) : (
        // if <Item.Label> was NOT passed, treat all the children except <Item.Caption> and <Item.LeadingVisual> as the label
        <>
          <FieldComponent.Label>{children}</FieldComponent.Label>
          {otherValidChildren}
        </>
      )}
    </FieldComponent>
  )
}

export type ChoiceFieldComponentProps = ComponentProps<typeof ChoiceFieldsetListItem>
export default Object.assign(ChoiceFieldsetListItem, {
  Caption: ChoiceFieldCaption,
  Label: ChoiceFieldLabel,
  LeadingVisual: ToggleInputLeadingVisual
})
