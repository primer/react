import {Select} from './Select'
export default {title: 'Forms/Select', component: Select}
const Example = () => (
  <Select>
    <Select.Trigger>
      <Select.Value placeholder="Choose a branch" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.List>
            <Select.Item value="main">main</Select.Item>
            <Select.Item value="next">next</Select.Item>
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select>
)
export const Default = {render: () => <Example />}
export const Playground = {render: () => <Example />}
