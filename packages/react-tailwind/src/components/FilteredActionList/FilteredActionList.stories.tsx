import {FilteredActionListComponent as FilteredActionList} from './FilteredActionList'

export default {component: FilteredActionList, title: 'Components/FilteredActionList'}
const items = [
  {id: 'apple', text: 'Apple'},
  {id: 'banana', text: 'Banana'},
  {id: 'orange', text: 'Orange'},
]

export const Default = {args: {items}, render: () => <FilteredActionList items={items} />}
export const Playground = {
  args: {items},
  render: () => <FilteredActionList items={items} selectionVariant="multiple" defaultSelectedItemIds={['apple']} />,
}
