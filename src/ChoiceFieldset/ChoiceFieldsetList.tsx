import React, {ChangeEvent} from 'react'
import styled from 'styled-components'
import {CheckboxInputField, RadioInputField} from '..'
import {get} from '../constants'
import {uniqueId} from '../utils/uniqueId'
import {Slot, ChoiceFieldsetContext} from './ChoiceFieldset'
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext'

export interface ChoiceFieldsetListProps {
  selectionVariant?: 'single' | 'multiple'
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;

  > li + li {
    margin-top: ${get('space.2')};
  }
`

const ChoiceFieldsetList: React.FC<ChoiceFieldsetListProps> = ({selectionVariant, children}) => {
  const initialSelectedChoices: string[] =
    React.Children.map(children, child => {
      if (React.isValidElement(child) && child.props.checked) {
        return child.props.value
      }

      return ''
    })?.filter(Boolean) || []
  const getSelectedCheckboxes = (value: string, checked: boolean): string[] => {
    if (checked) {
      return selectionVariant === 'multiple' ? [...initialSelectedChoices, value] : [value]
    }

    return initialSelectedChoices.filter(selectedValue => selectedValue !== value)
  }
  // generates a name to pass to radio inputs if one was not passed in ChoiceFieldset props
  const getRadioGroupName = (nameFromContext?: string) => {
    if (nameFromContext || selectionVariant !== 'multiple') {
      return nameFromContext
    }
    const generatedName = uniqueId()
    return generatedName
  }

  return (
    <Slot name="ChoiceList">
      {({name, onSelect}: ChoiceFieldsetContext) => (
        <ChoiceFieldsetListContext.Provider
          value={{
            initialSelectedChoices,
            name: getRadioGroupName(name),
            fieldComponent: selectionVariant === 'multiple' ? CheckboxInputField : RadioInputField,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              onSelect && onSelect(getSelectedCheckboxes(e.currentTarget.value, e.currentTarget.checked))
            }
          }}
        >
          <List>
            {React.Children.map(children, (child, i) => (
              <li key={i}>{child}</li>
            ))}
          </List>
        </ChoiceFieldsetListContext.Provider>
      )}
    </Slot>
  )
}

ChoiceFieldsetList.defaultProps = {
  selectionVariant: 'single'
}

export default ChoiceFieldsetList
