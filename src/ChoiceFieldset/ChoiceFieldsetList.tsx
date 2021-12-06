import React, {ChangeEvent} from 'react'
import styled from 'styled-components'
import {CheckboxInputField, RadioInputField} from '..'
import {get} from '../constants'
import {uniqueId} from '../utils/uniqueId'
import {Slot, ChoiceFieldsetContext} from './ChoiceFieldset'
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext'

export interface ChoiceFieldsetListProps {
  /**
   * Whether multiple items or a single item can be selected
   */
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

const ChoiceFieldsetList: React.FC<ChoiceFieldsetListProps> = ({selectionVariant, children}) => (
  <Slot name="ChoiceList">
    {({name, onSelect, disabled, selected = []}: ChoiceFieldsetContext) => {
      const getSelectedCheckboxes = (value: string, checked: boolean): string[] => {
        if (checked) {
          return selectionVariant === 'multiple' ? [...selected, value] : [value]
        }

        return selected.filter(selectedValue => selectedValue !== value)
      }
      return (
        <ChoiceFieldsetListContext.Provider
          value={{
            disabled,
            selected,
            name: name || uniqueId(),
            fieldComponent: selectionVariant === 'multiple' ? CheckboxInputField : RadioInputField,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              onSelect && onSelect(getSelectedCheckboxes(e.currentTarget.value, e.currentTarget.checked))
            },
            selectionVariant
          }}
        >
          <List>
            {React.Children.map(children, (child, i) => (
              <li key={i}>{child}</li>
            ))}
          </List>
        </ChoiceFieldsetListContext.Provider>
      )
    }}
  </Slot>
)

ChoiceFieldsetList.defaultProps = {
  selectionVariant: 'single'
}

export default ChoiceFieldsetList
