import React from 'react'
import {FilteredActionListContent} from '../FilteredActionList/FilteredActionList'
import type {FilteredActionListProps, ItemInput} from '../FilteredActionList'
import {FilteredActionListInput, type FilteredActionListInputProps} from '../FilteredActionList/FilteredActionListInput'
import {MappedActionListItem} from '../internal/components/MappedActionListItem'
import {SelectPanelItemBase, SelectPanelListBase, SelectPanelSearchInputBase} from './SelectPanelParts'
import {useMergedRefs} from '../hooks/useMergedRefs'
import {useSelectPanelContext} from './SelectPanelContext'

function ConfiguredSearchInput(props: FilteredActionListInputProps) {
  const {registerInput} = useSelectPanelContext()
  const ref = useMergedRefs(props.inputRef, registerInput)
  return <FilteredActionListInput {...props} inputRef={ref} InputComponent={SelectPanelSearchInputBase} />
}

const ConfiguredItem: typeof MappedActionListItem = React.forwardRef(function ConfiguredItem(props, ref) {
  return <MappedActionListItem {...props} ref={ref} ItemComponent={SelectPanelItemBase} />
})

const components = {
  Input: ConfiguredSearchInput,
  List: SelectPanelListBase,
  Item: ConfiguredItem,
}

function getItemKey(item: ItemInput, index: number) {
  return item.id === undefined ? index.toString() : `${typeof item.id}:${item.id}`
}

export function ConfiguredSelectPanelCollection(props: FilteredActionListProps) {
  return (
    <FilteredActionListContent
      {...props}
      components={components}
      getItemKey={getItemKey}
      componentName="SelectPanel.Collection"
    />
  )
}
