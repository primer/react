import {ActionMenu} from './ActionMenu'

export default {component: ActionMenu, title: 'Components/ActionMenu'}
export const Default = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Actions</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item>Copy link</ActionMenu.Item>
        <ActionMenu.Item variant="danger">Delete</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
export const Playground = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Labels</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.CheckboxItem>Bug</ActionMenu.CheckboxItem>
        <ActionMenu.CheckboxItem checked>Feature</ActionMenu.CheckboxItem>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
