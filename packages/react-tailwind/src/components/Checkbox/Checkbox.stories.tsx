import {Checkbox} from './Checkbox'
export default {title: 'Forms/Checkbox', component: Checkbox}
export const Default = {
  render: () => (
    <span className="flex gap-2">
      <Checkbox id="receive-updates" />
      <label htmlFor="receive-updates">Receive updates</label>
    </span>
  ),
}
export const Playground = {args: {defaultChecked: true, disabled: false}}
