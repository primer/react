import React from 'react'
import styled from 'styled-components'
import {useSSRSafeId} from '../..'
import {get} from '../../constants'
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

const getSelectedCheckboxes = (
  value: string,
  checked: boolean,
  selectedValues: string[],
  selectionVariant?: ChoiceFieldsetListProps['selectionVariant']
): string[] => {
  if (checked) {
    return selectionVariant === 'multiple' ? [...selectedValues, value] : [value]
  }

  return selectedValues.filter(selectedValue => selectedValue !== value)
}

const ChoiceFieldsetList: React.FC<ChoiceFieldsetListProps> = ({selectionVariant, children}) => {
  const ssrSafeUniqueName = useSSRSafeId()

  return (
    <Slot name="ChoiceList">
      {({name, onSelect, disabled, selected = []}: ChoiceFieldsetContext) => {
        return (
          <ChoiceFieldsetListContext.Provider
            value={{
              disabled,
              selected,
              name: name || ssrSafeUniqueName,
              onChange: e => {
                const updatedSelections = getSelectedCheckboxes(
                  e.currentTarget.value,
                  e.currentTarget.checked,
                  selected,
                  selectionVariant
                )
                onSelect && onSelect(updatedSelections)
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
}

ChoiceFieldsetList.defaultProps = {
  selectionVariant: 'single'
}

export default ChoiceFieldsetList
