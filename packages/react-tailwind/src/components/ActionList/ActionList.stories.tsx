import {ActionList} from './ActionList'

export default {component: ActionList, title: 'Components/ActionList'}
export const Default = {
  render: () => (
    <ActionList>
      <ActionList.Item>Open</ActionList.Item>
      <ActionList.Item>Close</ActionList.Item>
    </ActionList>
  ),
}
export const Playground = {
  render: () => (
    <ActionList role="listbox" selectionVariant="single">
      <ActionList.Item selected>Selected option</ActionList.Item>
    </ActionList>
  ),
}
