import {Checkbox} from '../Checkbox'
import {CheckboxGroup} from './CheckboxGroup'
export default {title: 'Forms/CheckboxGroup', component: CheckboxGroup}
export const Default = {
  render: () => (
    <CheckboxGroup>
      <span>
        <Checkbox id="checkbox-one" value="one" />
        <label htmlFor="checkbox-one"> One</label>
      </span>
      <span>
        <Checkbox id="checkbox-two" value="two" />
        <label htmlFor="checkbox-two"> Two</label>
      </span>
    </CheckboxGroup>
  ),
}
export const Playground = {
  args: {defaultValue: ['one'], disabled: false},
  render: (args: React.ComponentProps<typeof CheckboxGroup>) => (
    <CheckboxGroup {...args}>
      <Checkbox value="one" />
      <Checkbox value="two" />
    </CheckboxGroup>
  ),
}
